// Stats definitions and types
export interface DatingStat {
  title: string;
  stat: string;
  description: string;
  source: string;
  link: string;
}

export const DATING_STATS: DatingStat[] = [
  {
    title: "Dating App Usage",
    stat: "72%",
    description: "Most matches never turn into dates",
    source: "Pew Research",
    link: "https://www.pewresearch.org/internet/2020/02/06/the-virtues-and-downsides-of-online-dating/"
  },
  {
    title: "Response Rates",
    stat: "4%",
    description: "Most messages go unanswered",
    source: "OkCupid Data",
    link: "https://theblog.okcupid.com/a-womans-advantage-82d5074dde2d"
  },
  {
    title: "Time Investment",
    stat: "7.2h",
    description: "Endless swiping wastes hours weekly",
    source: "Dating App Study",
    link: "https://www.businessofapps.com/data/dating-app-market/"
  },
  {
    title: "Male:Female Ratio",
    stat: "9:1",
    description: "We help you stand out from the crowd",
    source: "Global Dating Insights",
    link: "https://www.netimperative.com/2019/04/05/online-dating-trends-men-outnumber-women-on-tinder-by-9-to-1-while-grinder-wins-for-age-diversity/"
  }
];