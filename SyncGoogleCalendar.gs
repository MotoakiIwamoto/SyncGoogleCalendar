/*
Title       : Sync Google Calendar
Description : 拠点間の G Suite のカレンダーを同期する
Author      : Motoak Iwamoto @ Allied Architects.
*/

// 同期先のGoogleCalendarID
var SYNC_DISTNATION_CALENDAR_ID = 'name@example.com';
 
// 同期する未来の日数
var SYNC_DAYS = 7;
    
// 同期しない予定のワード
var NOT_SYNC_WORD = 'notsync';

// 0:テストモード　 1:同期モード
var MODE = 0;

function syncGoogleCalendar() {
  // 同期元のカレンダー
  var syncBaseCalendar = CalendarApp.getDefaultCalendar();
  Logger.log(syncBaseCalendar.getId());
  
  // 同期する期間の計算
  var startTime = new Date();
  var endTime = new Date(Date.parse(startTime) + (60 * 60 * 24 * SYNC_DAYS * 1000));
  
  // 同期対象の予定取得
  var events = syncBaseCalendar.getEvents(startTime, endTime);
  
  // カレンダー同期
  for (var I in events) {
    Logger.log('----------');
    Logger.log(events[I].getTitle());
      
    // 不参加の予定は同期しない
    if (events[I].getMyStatus() == CalendarApp.GuestStatus.NO) {
      Logger.log('NO');
      continue;
    }
    
    // 同期しない予定の処理
    var notSyncWordReg = new RegExp(NOT_SYNC_WORD);
    if (events[I].getDescription().match(notSyncWordReg)){
      Logger.log('NOT SYNC');
      continue;
    }
    
    // 予定の参加者一覧を取得
    var members = events[I].getGuestList(true);
    
    // 予定に同期先のIDが既に含まれているかチェック
    var alreadyInclude = false;
    for (var Z in members) {
      if (members[Z].getEmail() == SYNC_DISTNATION_CALENDAR_ID) {
        alreadyInclude = true;
        Logger.log('ALREADY');
        break;
      }
    }
    
    // 予定に同期先のIDが含まれていなければ同期先を追加
    if (alreadyInclude == false) {
      Logger.log('SYNC');
      if (MODE != 0) {
        events[I].addGuest(SYNC_DISTNATION_CALENDAR_ID);
      }
    }
  }
}
