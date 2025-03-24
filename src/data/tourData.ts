interface TourCard {
    id: number;
    title: string;
    description: string;
    image: string;
    tags: string[];
    videoUrl: string;
  }
  
  export const tourData: TourCard[] = [
    {
      id: 1,
      title: "Shere Hills",
      description: "Take a virtual tour through the stunning Shere Hills, where you'll explore the rugged terrain",
      image: "path/to/shere-hills.jpg",
      tags: ["Virtual tour", "Rock Climbing", "Sailing"],
      videoUrl: "", // Add video URL
    },
    // Add more tours here
  ];