import React, { useEffect, useRef } from "react";

import styles from "./Weeks.module.scss";
import Layout from "@admin/components/Layout";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api, { type Api } from "@/scripts/api";
import usePutWeek from "./mutations/usePutWeek";
import useDeleteWeek from "./mutations/useDeleteWeek";
import CheckBoxCont from "@admin/components/CheckBoxCont";
import AsideCont from "@admin/components/AsideCont";
import { toast } from "react-toastify";

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
      queryClient.invalidateQueries({ queryKey: ["me"] });
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

  return (
    <AsideCont>
      <form
        onSubmit={(e) => {
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

          putWeekMutation.mutate(body, {
            onSuccess: () => {
              toast.success("Added week");
            },
          });
        }}
      >
        <label htmlFor="week">Week</label>
        <input required type="number" name="week" placeholder="Week" />
        <label htmlFor="year">Year</label>
        <input required type="number" name="year" placeholder="Year" />
        <label htmlFor="price">Price</label>
        <input required type="number" name="price" placeholder="Price" />
        <CheckBoxCont label="Booked" name="booked" />
        <CheckBoxCont label="Hidden" name="hidden" />
        <button className="button" type="submit">
          Add
        </button>
      </form>
    </AsideCont>
  );
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
        <button
          className="button"
          onClick={() => {
            deleteWeekMutation.mutate(
              {
                week: week.week,
                year: week.year,
              },
              {
                onSuccess: () => {
                  toast.success("Deleted week");
                },
              },
            );
          }}
        >
          Delete
        </button>
      </div>
      <form>
        <label htmlFor="price">Price</label>
        <input
          defaultValue={priceData.current}
          required
          type="number"
          name="price"
          onChange={(e) => {
            const value = e.currentTarget.value;

            setPriceTimeoutId.current &&
              clearTimeout(setPriceTimeoutId.current);
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
          }}
          placeholder="Price"
        />

        <CheckBoxCont
          label="Booked"
          name="booked"
          defaultChecked={week.booked}
          onChange={(e) => {
            putWeekMutation.mutate({
              week: week.week,
              year: week.year,
              price: priceData.current,
              booked: e.target.checked,
              hidden: week.hidden,
            });
          }}
        />
        <CheckBoxCont
          label="Hidden"
          name="hidden"
          defaultChecked={week.hidden}
          onChange={(e) => {
            putWeekMutation.mutate({
              week: week.week,
              year: week.year,
              price: priceData.current,
              booked: week.booked,
              hidden: e.target.checked,
            });
          }}
        />
      </form>
    </div>
  );
}

function idx(week: Api.Week) {
  return `${week.week}-${week.year}`;
}

export default React.memo(Weeks);
