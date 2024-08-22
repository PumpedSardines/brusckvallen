import "@/scripts/dayjsSvLocale";
import chevronRight from "@/icons/chevron-right.svg?raw";
import dayjs from "dayjs";
import { cx } from "@/scripts/cx";
import { formatPrice } from "@/scripts/formatPrice";
import { nextRenderFrame } from "@/scripts/nextRenderFrame";
import { html } from "@/scripts/html";
import type { Api } from "@/scripts/api";

const calendars = document.querySelectorAll<HTMLDivElement>(".calendar");

type Week = {
  number: number;
  year: number;
  price: number;
  booked: boolean;
  startDate: string;
  endDate: string;
};

(() => {
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
    const form = bookForm.querySelector<HTMLFormElement>("form")!;
    const submitButton = bookForm.querySelector<HTMLFormElement>(
      ".calendar__book-form__submit-button",
    )!;
    const weekInput = bookForm.querySelector<HTMLInputElement>(
      'input[name="weeks"]',
    )!;
    const formTextArea = bookForm.querySelector<HTMLInputElement>("textarea")!;

    const weeksDataArray = JSON.parse(
      calendar.getAttribute("data-calendar-weeks")!,
    ) as Api.Week[] | null;
    if (!weeksDataArray) {
      calendar.innerHTML = `COULDN'T LOAD DATA`;
      calendar.classList.remove("calendar--not-loaded");
      return;
    }
    const weeksData = Object.fromEntries(
      weeksDataArray.map((week) => [`${week.week}:${week.year}`, week]),
    );

    let currentDate = dayjs().startOf("month");

    for (let i = 0; i < 52; i++) {
      const iDate = currentDate.add(i, "weeks").startOf("week");
      const key = `${iDate.week()}:${iDate.year()}`;

      if (key in weeksData) {
        currentDate = iDate.startOf("month");
        break;
      }
    }

    const startDate = currentDate.clone();

    let formOpen = false;
    let isSubmitting = false;

    function setCalendarInnerWidth() {
      const width = calendar.clientWidth;
      calendarInner.style.width = `${width * 2}px`;
      updateHeight();
    }
    setCalendarInnerWidth();
    window.addEventListener("resize", setCalendarInnerWidth);

    const observer = new ResizeObserver(() => {
      updateHeight();
    });
    observer.observe(weekSelector);
    observer.observe(bookForm);

    function setFormOpen(open: boolean) {
      formOpen = open;
      render();
    }

    function nextMonth() {
      currentDate = currentDate.add(1, "month");
      render();
    }

    function prevMonth() {
      currentDate = currentDate.subtract(1, "month");
      render();
    }

    function backToToday() {
      currentDate = startDate.clone();
      render();
    }

    nextButton.addEventListener("click", nextMonth);
    prevButton.addEventListener("click", prevMonth);
    titleContainer.addEventListener("click", backToToday);
    goBackToWeekSelectButton.addEventListener("click", () => {
      if (isSubmitting) return;
      setFormOpen(false);
    });
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      formSubmit();
    });

    render();
    updateHeight();

    function updateHeight() {
      if (formOpen) {
        calendar.style.height = `${bookForm.clientHeight}px`;
      } else {
        calendar.style.height = `${weekSelector.clientHeight}px`;
      }
    }

    function setCalendarAsLoaded() {
      if (calendar.classList.contains("calendar--not-loaded")) {
        nextRenderFrame(() => {
          calendar.classList.remove("calendar--not-loaded");
        });
      }
    }

    function updateFormOpen() {
      const transition = () => {
        calendar.classList.add("calendar--transitioning");
        const onTransitionEnd = () => {
          calendar.classList.remove("calendar--transitioning");
          calendarInner.removeEventListener("transitionend", onTransitionEnd);
        };
        calendarInner.addEventListener("transitionend", onTransitionEnd);
      };

      const currentFormOpen: boolean = JSON.parse(
        form.getAttribute("data-form-open")!,
      );

      if (currentFormOpen === formOpen) {
        return;
      }

      if (formOpen) {
        formTextArea.style.height = "0px";
        calendarInner.classList.add("calendar__inner--form");
      } else {
        calendarInner.classList.remove("calendar__inner--form");
      }

      form.setAttribute("data-open", JSON.stringify(formOpen));

      updateHeight();
      transition();
    }

    function render() {
      calendar.setAttribute("data-form-open", JSON.stringify(formOpen));
      updateFormOpen();
      setCalendarAsLoaded();

      weeksContainer.innerHTML = "";
      const title = currentDate.format("MMMM YYYY");
      titleContainer.textContent = title;

      const weeks: Week[] = [];

      for (
        let i = 0;
        currentDate
          .add(i, "week")
          .startOf("week")
          .isBefore(currentDate.add(1, "month").add(1, "day"));
        i++
      ) {
        const weekDate = currentDate.add(i, "week").startOf("week");
        const weekData = weeksData[`${weekDate.week()}:${getYear(weekDate)}`];

        if (!weekData) {
          continue;
        }

        const week: Week = {
          number: weekDate.add(1, "day").week(),
          year: getYear(weekDate),
          booked: weekData.booked,
          price: weekData.price,
          startDate: weekDate.subtract(1, "day").format("dd D MMMM"),
          endDate: weekDate
            .add(1, "week")
            .subtract(1, "day")
            .format("dd D MMMM"),
        };

        weeks.push(week);
      }

      weeksContainer.classList.remove("calendar__weeks--no-weeks");
      if (weeks.length === 0) {
        weeksContainer.classList.add("calendar__weeks--no-weeks");

        const noWeeksElement = document.createElement("p");
        noWeeksElement.textContent = "Inga veckor går att boka denna månad";
        weeksContainer.appendChild(noWeeksElement);
      } else {
        for (const week of weeks) {
          const weekElement = document.createElement("button");
          if (!week.booked) {
            weekElement.addEventListener("click", () => {
              setFormOpen(true);
              weekInput.value = `Jag vill boka v${week.number} ${week.year}`;
            });
          }
          weekElement.classList.add("calendar__week");
          weekElement.innerHTML = weekTemplate(week);
          weeksContainer.appendChild(weekElement);
        }
      }
    }

    async function formSubmit() {
      const data = new FormData(form);
      const name = data.get("name") as string;
      const email = data.get("email") as string;
      const weeks = data.get("weeks") as string;
      const message = data.get("message") as string;

      submitButton.innerText = "Skickar...";
      const formElements = form.querySelectorAll<
        HTMLInputElement | HTMLTextAreaElement
      >("input, textarea");
      formElements.forEach((input) => {
        input.disabled = true;
      });
      isSubmitting = true;

      const body = JSON.stringify({
        name,
        email,
        weeks,
        message,
      });

      console.log(body);

      await new Promise((resolve) => setTimeout(resolve, 400));
      onSuccess();

      function onSuccess() {
        bookForm.innerHTML = `
        <div class="calendar__header">
          <p class="larger">Boka</p>
        </div>
        <div class="calendar__header__line"></div>
        <div class="calendar__book-form__submit-success-cont">
          <p class="large">Tack, vi har tagit emot din bokningförfrågan</p>
          <p class="large">Vi återkommer inom kort</p>
        </div>
      `;
      }

      function onFail() {
        formElements.forEach((input) => {
          input.disabled = false;
        });
        submitButton.innerText = "Skicka bokningsförfrågan";
        isSubmitting = false;
      }
    }
  }

  function weekTemplate(week: Week) {
    return html(`
    <div class="${cx(
      "calendar__week-inner",
      week.booked && "calendar__week-inner--booked",
    )}">
      <div class="calendar__week-inner-text">
        <p class="larger">v${week.number} - ${week.booked ? "Bokad" : formatPrice(week.price)}</p>
        <p>${week.startDate} - ${week.endDate}</p>
      </div>
      <div class="calendar__week-inner-chevron">
        ${chevronRight}
      </div>
    </div>
  `);
  }

  function getYear(date: dayjs) {
    const years = [date.year(), date.endOf("week").year()];

    if (years[0] !== years[1]) {
      if (date.week() === 1) {
        return years[1];
      } else {
        return years[0];
      }
    } else {
      return years[0];
    }
  }
})();
