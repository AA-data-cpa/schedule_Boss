// ใช้ Apps Script เป็น API ส่งข้อมูลปฏิทินเป็น JSON ให้หน้าเว็บบน GitHub
function doGet() {
  var output;
  try {
    output = getCalendarEvents();
  } catch (err) {
    output = { error: String(err && err.message ? err.message : err) };
  }
  return ContentService
    .createTextOutput(JSON.stringify(output))
    .setMimeType(ContentService.MimeType.JSON);
}

function getCalendarEvents() {
  var calendarId = 'family13510499638341609872@group.calendar.google.com';
  var calendar = CalendarApp.getCalendarById(calendarId);
  var tz = 'Asia/Bangkok';
  var fmt = "yyyy-MM-dd'T'HH:mm:ssXXX";

  var now = new Date();
  var start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  var end   = new Date(now.getFullYear(), now.getMonth() + 4, 1);

  return calendar.getEvents(start, end).map(function(ev) {
    var allDay = ev.isAllDayEvent();
    return {
      title: ev.getTitle(),
      allDay: allDay,
      start: allDay ? Utilities.formatDate(ev.getAllDayStartDate(), tz, 'yyyy-MM-dd')
                    : Utilities.formatDate(ev.getStartTime(), tz, fmt),
      end:   allDay ? Utilities.formatDate(ev.getAllDayEndDate(), tz, 'yyyy-MM-dd')
                    : Utilities.formatDate(ev.getEndTime(), tz, fmt),
      location: ev.getLocation() || '',
      description: ev.getDescription() || ''
    };
  });
}
