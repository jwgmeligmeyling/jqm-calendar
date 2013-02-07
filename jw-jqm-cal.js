(function($) {
   $.jqmCalendar = function(element, options) {
      
      var defaults = {
         events : [],
         date : new Date(),
         months : ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
         days : ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
         weeksInMonth : undefined,
         hideWeekends : false,
         startOfWeek : 0,   
      }

      var plugin = this;
      plugin.settings = null;

      var $element = $(element),
          element = element,
         $table,
         $header,
         $tbody,
         $listview;

      function init() {
         plugin.settings = $.extend({}, defaults, options);
         
         $table = $("<table class='jw-jqm-table'/>");
         
         var $thead = $("<thead/>").appendTo($table),
            $tr = $("<tr/>").appendTo($thead),
            $th = $("<th class='ui-bar-c header' colspan='7'/>");
         
         $previous = $("<a href='#' data-role='button' data-icon='arrow-l' data-iconpos='notext' class='previous-btn'>Previous</a>").click(function(event) {
            refresh(new Date(plugin.settings.date.getFullYear(), plugin.settings.date.getMonth() - 1, plugin.settings.date.getDate()));
         }).appendTo($th);
         
         $header = $("<span/>").appendTo($th);
         
         $previous = $("<a href='#' data-role='button' data-icon='arrow-r' data-iconpos='notext' class='next-btn'>Next</a>").click(function(event) {
            refresh(new Date(plugin.settings.date.getFullYear(), plugin.settings.date.getMonth() + 1, plugin.settings.date.getDate()));
         }).appendTo($th);
         
         $th.appendTo($tr);
         
         $tr = $("<tr/>").appendTo($thead);
         
         for ( var i = 0, days = [].concat(plugin.settings.days, plugin.settings.days).splice(plugin.settings.startOfWeek, 7); i < 7; i++ ) {
            $tr.append("<th class='ui-bar-c'><span class='hidden'>"  + days[i] + "</span></th>");
         }
         
         $tbody = $("<tbody/>").appendTo($table);
         
         $table.appendTo($element);
         $listview = $("<ul data-role='listview'/>").insertAfter($table);
         refresh(plugin.settings.date);      
      }
      
      function _firstDayOfMonth(date) {
         // [0-6] Sunday is 0, Monday is 1, and so on.
         return ( new Date(date.getFullYear(), date.getMonth(), 1) ).getDay();
      }
      
      function _daysBefore(date, fim) {
         // Returns [0-6], 0 when firstDayOfMonth is equal to startOfWeek, else the amount of days of the previous month included in the week.
         var firstDayInMonth = ( fim || _firstDayOfMonth(date) ),
            diff = firstDayInMonth - plugin.settings.startOfWeek;
         return ( diff >= 0 ) ? diff : ( 7 + diff );
      }
      
      function _daysInMonth(date) {
         // [1-31]
         return ( new Date ( date.getFullYear(), date.getMonth() + 1, 0 )).getDate();
      }

      function _daysAfter(date, wim, dim, db) {
         // Returns [0-6] amount of days from the next month
         return    (( wim || _weeksInMonth(date) ) * 7 ) - ( dim || _daysInMonth(date) ) - ( db || _daysBefore(date));
      }
            
      function _weeksInMonth(date, dim, db) {
         // Returns [5-6];
         return ( plugin.settings.weeksInMonth ) ? plugin.settings.weeksInMonth : Math.ceil( ( ( dim || _daysInMonth(date) ) + ( db || _daysBefore(date)) ) / 7 );
      }
      
      function addCell($row, date, hidden, selected) {
         var $td = $("<td class='ui-body-c' />").appendTo($row);
         if ( hidden ) $td.addClass("hidden");
         var $a = $("<a href='#' class='ui-btn ui-btn-up-c'/>")
                  .html(date.getDate().toString())
                  .data('date', date)
                  .click(cellClickHandler)
                  .appendTo($td);
         if ( selected ) $a.click();
         if ( ! hidden ) {
            for (    var   i = 0,
                     event,
                     begin = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0),
                     end = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1, 0, 0, 0, 0);
                  event = plugin.settings.events[i]; i++ ) {
               if ( event.end > begin && event.begin < end ) {
                  $a.append("<span>&bull;</span>");
                  break;
               }
            }
         }
      }
      
      function cellClickHandler(event) {
         var $this = $(this),
            date = $this.data('date');
         $tbody.find("a.ui-btn-active").removeClass("ui-btn-active");
         $this.addClass("ui-btn-active");
         
         if ( date.getMonth() !== plugin.settings.date.getMonth() ) {
            refresh(date);
         } else {
            $element.trigger('change', date);
         }
      }
      
      function refresh(date) {
         plugin.settings.date = date = date ||  plugin.settings.date || new Date();
                  
         var year = date.getFullYear(),
            month = date.getMonth(),
            firstDayOfMonth = _firstDayOfMonth(date),
            daysBefore = _daysBefore(date, firstDayOfMonth),
            daysInMonth = _daysInMonth(date),
            weeksInMonth = _weeksInMonth(date, daysInMonth, daysBefore);
         
         $tbody.empty(); 
         $header.html( plugin.settings.months[month] + " " + year.toString() );
      
         for (    var   weekIndex = 0,
                  daysInMonthCount = 1,
                  daysAfterCount = 1; weekIndex < weeksInMonth; weekIndex++ ) {
                     
            var daysInWeekCount = 0,
               row = $("<tr/>").appendTo($tbody);
                        
            while ( daysBefore > 0 ) {
               addCell(row, new Date(year, month, 1 - daysBefore), true);
               daysBefore--;
               daysInWeekCount++;
            }
            
            while ( daysInWeekCount < 7 && daysInMonthCount <= daysInMonth ) {
               addCell(row, new Date(year, month, daysInMonthCount), false, daysInMonthCount === date.getDate() );
               daysInWeekCount++;
               daysInMonthCount++;
            }
            
            while ( daysInMonthCount > daysInMonth && daysInWeekCount < 7 ) {
               addCell(row, new Date(year, month, daysInMonth + daysAfterCount), true);
               daysInWeekCount++;
               daysAfterCount++;
            }
         }
         
         $element.trigger('create');
      }

      $element.bind('change', function(event, begin) {
         var   end = new Date(begin.getFullYear(), begin.getMonth(), begin.getDate() + 1, 0,0,0,0);
         $listview.empty();

         for (    var   i = 0, event; event = plugin.settings.events[i]; i++ ) {
            if ( event.end > begin && event.begin < end ) {
               var summary    = event["summary"],
                  beginTime   = event["begin"].toTimeString().substr(0,5),
                  endTime      = event["end"].toTimeString().substr(0,5),
                  timeString   = beginTime + "-" + endTime;
               $("<li>" + ( ( timeString != "00:00-00:00" ) ? timeString : "" ) + " " + summary + "</li>").appendTo($listview);   
            }
         }

         $listview.trigger('create').filter(".ui-listview").listview('refresh');
      });
      
      $element.bind('refresh', function(event, date) {
         refresh(date);
      });

      init();
   }

   $.fn.jqmCalendar = function(options) {

      return this.each(function() {
         if (undefined == $(this).data('jqmCalendar')) {
            var plugin = new $.jqmCalendar(this, options);
         }
      });

   }

})(jQuery);