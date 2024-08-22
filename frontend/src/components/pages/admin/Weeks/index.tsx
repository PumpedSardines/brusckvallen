import React, { useEffect, useRef } from "react";

import styles from "./Weeks.module.scss";
import Layout from "@admin/components/Layout";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api, { type Api } from "@/scripts/api";
import usePutWeek from "./mutations/usePutWeek";
import useDeleteWeek from "./mutations/useDeleteWeek";

function Weeks() {
  const queryClient = useQueryClient();

  const {
    data: weeks,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["weeks"],
    queryFn: async () => {
      const res = await api().weeks.getAll(true);

      if (!res.ok) {
        throw new Error("Something went wrong");
      }

      return res.payload;
    },
  });

  useEffect(() => {
    if (isError) {
      queryClient.invalidateQueries({ queryKey: ["is-logged-in"] });
    }
  }, [isError]);

  if (isLoading) {
    return;
  }

  return (
    <Layout title="Weeks" aside={<Aside />}>
      {weeks == null || weeks.length === 0 ? (
        <p>No weeks added</p>
      ) : (
        weeks.map((week) => <Week key={idx(week)} week={week} />)
      )}
    </Layout>
  );
}

function Aside() {
  const putWeekMutation = usePutWeek();

  return <div className={styles.aside}>
    <p className="larger">Add week</p>
    <form onSubmit={e => {
      e.preventDefault();
      const data = new FormData(e.target as HTMLFormElement);

      const week = data.get("week") as string;
      const year = data.get("year") as string;
      const price = data.get("price") as string;
      const booked = data.get("booked") as string | null;
      const hidden = data.get("hidden") as string | null;

      const body = {
        week: parseInt(week),
        year: parseInt(year),
        price: parseInt(price),
        booked: booked === "on",
        hidden: hidden === "on",
      };

      putWeekMutation.mutate(body);
    }}>
      <label htmlFor="week">Week</label>
      <input required type="number" name="week" placeholder="Week" />
      <label htmlFor="year">Year</label>
      <input required type="number" name="year" placeholder="Year" />
      <label htmlFor="price">Price</label>
      <input required type="number" name="price" placeholder="Price" />
      <div className={styles.checkboxCont}>
        <input type="checkbox" name="booked" />
        <label htmlFor="booked">Booked</label>
      </div>
      <div className={styles.checkboxCont}>
        <input type="checkbox" name="hidden" />
        <label htmlFor="hidden">Hidden</label>
      </div>
      <button type="submit">Add</button>
    </form>
  </div>;
}

type WeekProps = {
  week: Api.Week;
};

function Week(props: WeekProps) {
  const { week } = props;

  const putWeekMutation = usePutWeek();
  const deleteWeekMutation = useDeleteWeek();

  const priceData = useRef(week.price);
  const setPriceTimeoutId = useRef<number | null>(null);

  return (
    <div className={styles.week}>
      <div className={styles.weekHeader}>
        <p className="larger">
          v{week.week} - {week.year}
        </p>
        <button onClick={() => {
          deleteWeekMutation.mutate({
            week: week.week,
            year: week.year,
          });
        }}>Delete</button>
      </div>
      <form>
        <label htmlFor="price">Price</label>
        <input defaultValue={priceData.current} required type="number" name="price" onChange={e => {
          const value = e.currentTarget.value;

          setPriceTimeoutId.current && clearTimeout(setPriceTimeoutId.current);
          priceData.current = parseInt(value);

          setPriceTimeoutId.current = setTimeout(() => {
            putWeekMutation.mutate({
              week: week.week,
              year: week.year,
              price: priceData.current,
              booked: week.booked,
              hidden: week.hidden,
            });
          }, 500);
        }} placeholder="Price" />
        <div className={styles.checkboxCont}>
          <input type="checkbox" defaultChecked={week.booked} onChange={e => {
            putWeekMutation.mutate({
              week: week.week,
              year: week.year,
              price: priceData.current,
              booked: e.target.checked,
              hidden: week.hidden,
            });
          }} name="booked" />
          <label htmlFor="booked">Booked</label>
        </div>
        <div className={styles.checkboxCont}>
          <input
            defaultChecked={week.hidden}
            onChange={e => {
              putWeekMutation.mutate({
                week: week.week,
                year: week.year,
                price: priceData.current,
                booked: week.hidden,
                hidden: e.target.checked,
              });
            }}
            type="checkbox"
            name="hidden"
          />
          <label htmlFor="hidden"
          >Hidden</label>
        </div>
      </form>
    </div>
  );
}

function idx(week: Api.Week) {
  return `${week.week}-${week.year}`;
}

export default React.memo(Weeks);
