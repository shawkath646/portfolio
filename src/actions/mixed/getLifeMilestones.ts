"use server";
import { cache } from "react";
import { LifeEvent } from "@/types/common.types";

const lifeEvents: LifeEvent[] = [
    {
        id: "1",
        title: "<time> Since My Actual Birth",
        desc: "The day I first opened my eyes to the world.",
        timestamp: new Date("2004-07-30"),
    },
    {
        id: "2",
        title: "<time> Since My Official Birthdate",
        desc: "The date that officially exists on all my documents and records.",
        timestamp: new Date("2005-12-30"),
    },
    {
        id: "3",
        title: "<time> Since Leaving Bangladesh",
        desc: "The first time I boarded a plane, leaving behind my family and my comfort zone to chase my dreams.",
        timestamp: new Date("2025-02-20"),
    },
    {
        id: "4",
        title: "<time> Since Stepping Foot in a New Country",
        desc: "Landing in an entirely unfamiliar place, marking the true beginning of the hustle to manifest my life's dreams.",
        timestamp: new Date("2025-02-21"),
    },
    {
        id: "5",
        title: "<time> Since Getting My First Visa",
        desc: "The official stamp of approval that opened the door to my journey abroad.",
        timestamp: new Date("2025-02-22"),
    },
    {
        id: "6",
        title: "<time> Since a Great Afternoon on Top of Dobong Peak",
        desc: "My first time hiking up a mountain. It was a physically demanding but incredibly rewarding afternoon reaching the summit of Dobongsan.",
        timestamp: new Date("2025-05-30"),
    },
    {
        id: "7",
        title: "<time> Since Earning My First Salary",
        desc: "A huge milestone. The day my hard work and independence translated into my very first paycheck.",
        timestamp: new Date("2025-06-02"),
    },
    {
        id: "8",
        title: "<time> Since Publishing This Portfolio",
        desc: "The day I finally put my personal corner of the internet out into the world to showcase my journey and skills.",
        timestamp: new Date("2025-06-26"),
    },
    {
        id: "9",
        title: "<time> Since My First IELTS Result",
        desc: "The culmination of months of preparation, clearing the path for my international goals.",
        timestamp: new Date("2024-07-13"),
    },
    {
        id: "10",
        title: "<time> Since I Cried for Someone",
        desc: "A deeply personal moment of heartbreak and growth that taught me a lot about myself and resilience.",
        timestamp: new Date("2022-02-04"),
    },
    {
        id: "11",
        title: "<time> Since the Family Bus Accident",
        desc: "A terrifying experience, but all credit goes to Almighty Allah that everyone was safe with only minor physical injuries. A reminder of how precious life is.",
        timestamp: new Date("2018-02-21"),
    }
];

export const getLifeMilestones = cache(async (): Promise<LifeEvent[]> => {
    const today = new Date();

    const processedEvents = lifeEvents.map((event) => {
        const eventDate = event.timestamp;

        let yearsDiff = today.getFullYear() - eventDate.getFullYear();

        const hasAnniversaryPassedThisYear =
            today.getMonth() > eventDate.getMonth() ||
            (today.getMonth() === eventDate.getMonth() && today.getDate() >= eventDate.getDate());

        if (!hasAnniversaryPassedThisYear) {
            yearsDiff--;
        }
        let timeString = "";

        if (yearsDiff < 0) {
            timeString = "Upcoming";
        } else if (yearsDiff === 0) {
            timeString = "Less than a year";
        } else if (yearsDiff === 1) {
            timeString = "1 Year";
        } else {
            timeString = `${yearsDiff} Years`;
        }

        const finalTitle = event.title.replace("<time>", timeString);

        return {
            ...event,
            title: finalTitle,
        };
    });

    return processedEvents;
});