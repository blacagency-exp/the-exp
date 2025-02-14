import { PackageCard } from "./package-card";
import { styles } from "@/constants/styles";

const packages = [
  {
    title: "Discoverer",
    duration: "3 days, 2 nights",
    price: 50,
    features: [
      { text: "Accommodation" },
      { text: "Transport within Jos" },
      { text: "Breakfast" },
    ],
    description:
      "Ideal for: Adventurers looking for an in-depth experience that combines cultural insights with nature hikes, scenic tours, and personalized guidance.",
    type: "Discoverer" as const,
  },
  {
    title: "Explorer",
    duration: "5 days, 4 nights",
    price: 75,
    features: [
      { text: "Breakfast" },
      { text: "Accommodation" },
      { text: "Transport within Jos" },
      { text: "Meals" },
      { text: "Entrance Fees" },
    ],
    description:
      "Ideal for: Explorers who want a well-rounded experience with visits to cultural landmarks, scenic viewpoints, and local markets.",
    type: "Explorer" as const,
  },
  {
    title: "Adventurer",
    duration: "7 days, 5 nights",
    price: 100,
    features: [
      { text: "Accommodation" },
      { text: "Breakfast" },
      { text: "Transport within Jos" },
      { text: "Dedicated local tour guide" },
      { text: "Entrance Fees" },
      { text: "Meals" },
      { text: "Guided Outdoor Excursions" },
    ],
    description:
      "Ideal for: Adventurers looking for an in-depth experience that combines cultural insights with nature hikes, scenic tours, and personalized guidance.",
    type: "Adventurer" as const,
  },
];

export function TravelPackages() {
  return (
    <section className="py-24">
      <div className={styles.section.container}>
        <h2 className="text-5xl font-bold text-center mb-16">Travel Packages</h2>
        <div className="max-w-4xl mx-auto">
          {packages.map((pkg, index) => (
            <PackageCard key={index} {...pkg} />
          ))}
        </div>
      </div>
    </section>
  );
}