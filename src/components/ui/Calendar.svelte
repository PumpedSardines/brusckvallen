<script context="module">
import dayjs from 'dayjs'
import weekOfYear from "dayjs/plugin/weekOfYear";

import chevronRight from "../../icons/chevron-right.svg?raw"
import chevronLeft from "../../icons/chevron-left.svg?raw"

dayjs.extend(weekOfYear)
const swedishLocale = {
  name: 'sv',
  weekStart: 1, 
  weekdaysMin: 'Sön_Mån_Tis_Ons_Tor_Fre_Lör'.split('_'),
  months: 'Januari_Februari_Mars_April_Maj_Juni_Juli_Augusti_Septemper_Oktober_November_December'.split('_'),
}
dayjs.locale(swedishLocale, null, true)
dayjs.locale('sv')
</script>

<script>
let currentDate = dayjs().startOf('month');

function nextMonth() {
  currentDate = currentDate.add(1, 'month')
}

function prevMonth() {
  currentDate = currentDate.subtract(1, 'month')
}

function getWeeksInMonth(date) {
  const weeks = [];

  for(let i = 0; date.add(i, "weeks").isBefore(date.add(1, 'month')); i++) {
    const weekDate = date.add(i, "weeks");

    const number = weekDate.week();
    const startDate = weekDate.startOf('week').format("dd D MMM");
    const endDate = weekDate.endOf('week').format("dd D MMM");
    weeks.push({
      number,
      startDate,
      endDate
    });
  }

  return weeks;
}

$: title = currentDate.format('MMMM YYYY')

$: weeks = getWeeksInMonth(currentDate)

</script>

<div class="calendar">

  <div class="calendar__header">
    <button class="calendar__icon-button" on:click={prevMonth}>
      {@html chevronLeft}
    </button>
    <p class="larger">{title}</p>
    <button class="calendar__icon-button" on:click={nextMonth}>
      {@html chevronRight}
    </button>
  </div>

  <div class="calendar__header__line"></div>
  
  <div class="calendar__outer-days">
    <div class="calendar__weeks">
      {#each weeks as week}
        
        <div class="calendar__week">
          <div class="calendar__week-inner">
            <p class="larger">v{week.number} - 11 000 kr</p>
            <p>{week.startDate} - {week.endDate}</p>
          </div>
        </div>

      {/each}
    </div>
  </div>
</div>

<style lang="scss">
@use "sass:math";

@import "../../styles/variables.scss";

.calendar {
  border: solid 1px var(--border-primary);
  background-color: var(--background-secondary);
  padding-bottom: spacing(2);
}

.calendar__header {
  padding: spacing(2, 3);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 0;
}

.calendar__icon-button {
  all: unset;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;


  :global(svg) {
    height: 1rem;
  }
}

.calendar__header__line {
  width: calc(100% - #{spacing(4)});
  height: 1px;
  margin: spacing(2);
  margin-bottom: spacing(1);
  background-color: var(--border-primary);
}

.calendar__outer-days {
  position: relative;
}

.calendar__weeks {
  padding: spacing(0, 0);
}

.calendar__week-inner {
  padding: spacing(2, 1);
}

.calendar__week {
  padding: spacing(0, 1);
  margin-top: spacing(2);
  box-sizing: border-box;

  position: relative;

  .larger {
    margin-bottom: spacing(0.5);
  }

  &::before {
    content: " ";
    display: block;
    position: absolute;
    left: 50%;
    top: spacing(-1);
    transform: translateX(-50%);
    width: calc(100% - #{spacing(4)});
    height: 1px;
    background-color: var(--border-primary);
  }

  &:first-child {
    margin-top: spacing(1);

    &::before {
      display: none;
    }
  }
}

.calendar__footer {
  padding: spacing(2, 3);
  display: flex;
  justify-content: center;
  align-items: center;
}

</style>
