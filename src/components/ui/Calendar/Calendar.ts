import "@/scripts/dayjsSvLocale";
import chevronRight from "@/icons/chevron-right.svg?raw";
import dayjs from "dayjs";

const calendars = document.querySelectorAll<HTMLDivElement>(".calendar");

type Week = {
  number: number;
  price: number;
  booked: boolean;
  special: boolean;
  startDate: string;
  endDate: string;
};

for (const calendar of calendars) {
  const calendarInner =
    calendar.querySelector<HTMLDivElement>(".calendar__inner")!;

  const weekSelector = calendar.querySelector<HTMLDivElement>(
    ".calendar__week-selector",
  )!;
  const bookForm = calendar.querySelector<HTMLDivElement>(
    ".calendar__book-form",
  )!;

  const weeksContainer =
    weekSelector.querySelector<HTMLDivElement>(".calendar__weeks")!;
  const titleContainer = weekSelector.querySelector<HTMLParagraphElement>(
    ".calendar__header__title",
  )!;
  const nextButton = weekSelector.querySelector<HTMLButtonElement>(
    ".calendar__next-button",
  )!;
  const prevButton = weekSelector.querySelector<HTMLButtonElement>(
    ".calendar__prev-button",
  )!;

  const goBackToWeekSelectButton = bookForm.querySelector<HTMLButtonElement>(
    ".calendar__back-button",
  )!;
  const weekInput = bookForm.querySelector<HTMLInputElement>(
    'input[name="weeks"]',
  )!;

  let currentDate = dayjs().startOf("month");
  let formOpen = true;

  function setCalendarInnerWidth() {
    const width = calendar.clientWidth;
    calendarInner.style.width = `${width * 2}px`;
    render();
  }
  setCalendarInnerWidth();
  window.addEventListener("resize", setCalendarInnerWidth);

  function nextMonth() {
    currentDate = currentDate.add(1, "month");
    render();
  }

  function setFormOpen(open: boolean) {
    formOpen = open;
    render();
  }

  function prevMonth() {
    currentDate = currentDate.subtract(1, "month");
    render();
  }

  function backToToday() {
    currentDate = dayjs().startOf("month");
    render();
  }

  nextButton.addEventListener("click", nextMonth);
  prevButton.addEventListener("click", prevMonth);
  titleContainer.addEventListener("click", backToToday);
  goBackToWeekSelectButton.addEventListener("click", () => setFormOpen(false));

  render();

  function render() {
    if (formOpen) {
      calendarInner.classList.add("calendar__inner--form");
      calendar.style.height = `${bookForm.clientHeight}px`;
    } else {
      calendarInner.classList.remove("calendar__inner--form");
      calendar.style.height = `${weekSelector.clientHeight}px`;
    }

    calendar.classList.remove("not-loaded");
    weeksContainer.innerHTML = "";
    const title = currentDate.format("MMMM YYYY");
    titleContainer.textContent = title;

    const weeks: Week[] = [];

    for (
      let i = 0;
      currentDate.add(i, "week").isBefore(currentDate.add(1, "month"));
      i++
    ) {
      const weekDate = currentDate
        .add(i, "week")
        .startOf("week")
        .subtract(1, "day");
      const week: Week = {
        number: weekDate.add(1, "day").week(),
        booked: false,
        special: i == 2,
        price: 11000,
        startDate: weekDate.format("dd D MMMM"),
        endDate: weekDate.add(1, "week").format("dd D MMMM"),
      };

      weeks.push(week);
    }

    for (const week of weeks) {
      const weekElement = document.createElement("button");
      if (!week.booked) {
        weekElement.addEventListener("click", () => {
          setFormOpen(true);
          weekInput.value = `Jag vill boka v${week.number}`;
        });
      }
      weekElement.classList.add("calendar__week");
      weekElement.innerHTML = weekTemplate(week);
      weeksContainer.appendChild(weekElement);
    }
  }
}

function formatPrice(price: number): string {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function weekTemplate(week: Week) {
  return `
    <div class="${cx(
      "calendar__week-inner",
      week.special && "calendar__week-inner--special",
    )}">
      <div class="calendar__week-inner-text">
        <p class="larger">v${week.number} - ${formatPrice(week.price)} kr</p>
        <p>${week.startDate} - ${week.endDate}</p>
      </div>
      <div class="calendar__week-inner-chevron">
        ${chevronRight}
      </div>
    </div>
  `;
}

function cx(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}
