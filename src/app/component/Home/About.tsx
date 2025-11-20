"use client";
import React, { useEffect, useState } from "react";

const DEFAULT_ABOUT = {
  heading: "About Us",
  description:
    "Established in 1958, Narsingh Dass Group is a multifarious trading group which is based on the values of Trust, Compassion, Togetherness and Excellence. Shivananda Marketing Pvt. Ltd.,a group company, offers innovative technologies and specialty materials in emerging and growing sectors of our society. Over the years, it has become one of the leading solution providers of high-performance chemicals and fibres in the paper, building and infrastructure sector of India",
  yearsTitle: "35+",
  yearsSubtitle: "years of Business Excellence",
  establishedLabel: "Established in",
  establishedYear: "1989",
  projectsCount: "250+",
  projectsLabel: "National and State Projects",
};

const About = () => {
  const [content, setContent] = useState(DEFAULT_ABOUT);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/content/about/home', { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          if (json?.content) setContent({ ...DEFAULT_ABOUT, ...json.content });
        }
      } catch (_) {}
    }
    load();
  }, []);

  return (
    <section className="py-10 sm:py-12 md:py-12 lg:py-15">
      <div className="container mx-auto px-4 md:px-8 ">
        <div className="flex flex-wrap gap-8 xl:gap-0">
          <div className="w-full xl:w-5/12">
            <h3 className="text-primaryColor text-lg leading-6 mb-3 font-medium">
              {content.heading}
            </h3>
            <div>
              <div className="xl:w-9/12">
                <p className="text-Body text-gray-700 text-lg font-medium mb-3">
                  {content.description}
                </p>
              </div>
            </div>
          </div>
          <div className="w-full xl:w-7/12 lg:pl-10">
            <div className="grid gap-6 grid-cols-2 items-stretch">
              <div
                className="bg-primaryColor rounded-[20px] px-4 py-5 md:px-6 md:py-10 xl:px-11 xl:py-12 
                col-span-2 md:col-span-1 row-span-2 text-center flex flex-col justify-center items-center min-h-[180px] md:min-h-[250px]"
              >
                <h1 className="text-6xl sm:text-5xl md:text-7xl pb-3 md:pb-6 text-Light font-bold">
                  {content.yearsTitle}
                </h1>
                <p className="text-xl sm:text-lg md:text-4xl xl:text-5xl text-Light font-semibold leading-[30px] md:leading-[30px]">
                  {content.yearsSubtitle}
                </p>
              </div>

              <div className="bg-secondaryColor text-accentColor rounded-[20px] py-5 px-5 xl:px-11 min-h-[150px] flex flex-col justify-center">
                <p className="text-base md:text-lg font-semibold md:leading-[25px]">
                  {content.establishedLabel}
                </p>
                <h1 className="text-5xl md:text-6xl pb-[15px] font-bold">
                  {content.establishedYear}
                </h1>
              </div>
              <div className="bg-[#EFEFEF] text-accentColor rounded-[20px] py-4 px-5 xl:px-11 min-h-[150px] flex flex-col justify-center">
                <h1 className="text-5xl md:text-6xl pb-[15px] font-bold">
                  {content.projectsCount}
                </h1>
                <p className="text-base md:text-lg font-semibold md:leading-[25px]">
                  {content.projectsLabel}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
