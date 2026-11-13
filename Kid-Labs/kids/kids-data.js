/**
 * MyCarbonCredit Kids Quiz — Approved Data & Authoritative Engines
 * Source of Truth: My_Carbon_Credit_Research_Template.xlsx
 *
 * Security & Pedagogical Architecture:
 * 1. Public question objects returned by MCCKidsData.getQuestionBank(ageGroup)
 *    DO NOT contain Correct_Answer, Scoring_Rule, or Option_A..D_Score.
 *    Scores and answer keys are sealed inside a private closure and are only
 *    evaluated after an answer is locked/submitted (or by the Apps Script backend).
 * 2. Emission factors are managed through a central Emission_Factors structure
 *    loaded from the backend (Code.gs) with a verified repository fallback so
 *    calculations never use undocumented magic numbers.
 */
(function () {
  "use strict";

  // =========================================================================
  // 1. APPROVED QUESTION BANKS (50 Total: 25 Explorer 8-10, 25 Changemaker 11-14)
  // =========================================================================
  const RAW_KIDS_QUESTIONS_8_10 = [
    {
      Question_ID: "KID001",
      Age_Group: "8-10",
      Category: "Water Conservation",
      Sub_Category: "Daily Water Use",
      Difficulty: "Easy",
      Question_Type: "Habit",
      Question_Text: "When you brush your teeth, what do you usually do with the tap?",
      Option_A: "Turn it off while brushing",
      Option_B: "Turn it off sometimes",
      Option_C: "Rarely turn it off",
      Option_D: "Keep it running",
      Explanation: "Turning off the tap while brushing helps save water.",
      Green_Points: 10,
      Sort_Order: 1,
      Status: "Active",
      Assessment_Dimension: "Sustainable Habits",
      Topic_ID: "WATER_CONSERVATION",
      Competency_ID: "WATER_BEHAVIOUR",
      Maximum_Points: 10,
      Interaction_Idea: "Bathroom scene; water-drop character and water tank react to the selected habit.",
      sceneType: "water_tap"
    },
    {
      Question_ID: "KID002",
      Age_Group: "8-10",
      Category: "Water Conservation",
      Sub_Category: "Handwashing",
      Difficulty: "Easy",
      Question_Type: "Habit",
      Question_Text: "When you apply soap while washing your hands, what do you usually do?",
      Option_A: "Turn off the tap",
      Option_B: "Sometimes turn it off",
      Option_C: "Rarely turn it off",
      Option_D: "Keep the tap running",
      Explanation: "Turning off the tap while applying soap avoids unnecessary water use.",
      Green_Points: 10,
      Sort_Order: 2,
      Status: "Active",
      Assessment_Dimension: "Sustainable Habits",
      Topic_ID: "WATER_CONSERVATION",
      Competency_ID: "WATER_BEHAVIOUR",
      Maximum_Points: 10,
      Interaction_Idea: "Animated handwashing scene with tap control and water meter.",
      sceneType: "water_tap"
    },
    {
      Question_ID: "KID003",
      Age_Group: "8-10",
      Category: "Energy Conservation",
      Sub_Category: "Switching Off",
      Difficulty: "Easy",
      Question_Type: "Habit",
      Question_Text: "When you leave a room, what do you usually do with the lights and fan?",
      Option_A: "Switch them off when not needed",
      Option_B: "Sometimes switch them off",
      Option_C: "Rarely switch them off",
      Option_D: "Leave them on",
      Explanation: "Switching off unused appliances helps save electricity.",
      Green_Points: 10,
      Sort_Order: 3,
      Status: "Active",
      Assessment_Dimension: "Sustainable Habits",
      Topic_ID: "ENERGY_CONSERVATION",
      Competency_ID: "ENERGY_BEHAVIOUR",
      Maximum_Points: 10,
      Interaction_Idea: "Interactive bedroom; light and fan switches change the energy meter.",
      sceneType: "energy_switch"
    },
    {
      Question_ID: "KID004",
      Age_Group: "8-10",
      Category: "Waste & Recycling",
      Sub_Category: "Reusable Bottle",
      Difficulty: "Easy",
      Question_Type: "Habit",
      Question_Text: "How often do you carry a reusable water bottle?",
      Option_A: "Always (Every day to school and outings)",
      Option_B: "Sometimes (On most days)",
      Option_C: "Rarely (Only once in a while)",
      Option_D: "Never (I usually use disposable bottles)",
      Explanation: "Reusable bottles can reduce the need for single-use plastic bottles.",
      Green_Points: 10,
      Sort_Order: 4,
      Status: "Active",
      Assessment_Dimension: "Sustainable Habits",
      Topic_ID: "WASTE_&_RECYCLING",
      Competency_ID: "PLASTIC_REDUCTION",
      Maximum_Points: 10,
      Interaction_Idea: "Reusable bottle superhero appears; plastic meter changes.",
      sceneType: "waste_bins"
    },
    {
      Question_ID: "KID005",
      Age_Group: "8-10",
      Category: "Food Sustainability",
      Sub_Category: "Portion Habits",
      Difficulty: "Easy",
      Question_Type: "Habit",
      Question_Text: "How often do you take only as much food as you can finish?",
      Option_A: "Always (I take what I can finish on my plate)",
      Option_B: "Sometimes (Most of the time)",
      Option_C: "Rarely (I often leave food on my plate)",
      Option_D: "Never (I don't check how much I take)",
      Explanation: "Taking a suitable portion can help prevent food waste.",
      Green_Points: 10,
      Sort_Order: 5,
      Status: "Active",
      Assessment_Dimension: "Sustainable Habits",
      Topic_ID: "FOOD_SUSTAINABILITY",
      Competency_ID: "FOOD_WASTE_BEHAVIOUR",
      Maximum_Points: 10,
      Interaction_Idea: "Plate-filling game with a food-waste meter.",
      sceneType: "food_plate"
    },
    {
      Question_ID: "KID006",
      Age_Group: "8-10",
      Category: "Nature & Biodiversity",
      Sub_Category: "Care for Nature",
      Difficulty: "Easy",
      Question_Type: "Habit",
      Question_Text: "How often do you help care for plants or keep your surroundings clean?",
      Option_A: "Often (I regularly water plants or keep my space tidy)",
      Option_B: "Sometimes (When a parent or teacher reminds me)",
      Option_C: "Rarely (Only once in a while)",
      Option_D: "Never (I haven't started doing this yet)",
      Explanation: "Small actions can help protect plants and local green spaces.",
      Green_Points: 10,
      Sort_Order: 6,
      Status: "Active",
      Assessment_Dimension: "Sustainable Habits",
      Topic_ID: "NATURE_&_BIODIVERSITY",
      Competency_ID: "BIODIVERSITY_BEHAVIOUR",
      Maximum_Points: 10,
      Interaction_Idea: "Mini garden grows flowers and butterflies based on the response.",
      sceneType: "nature_garden"
    },
    {
      Question_ID: "KID007",
      Age_Group: "8-10",
      Category: "Circular Economy",
      Sub_Category: "Reuse and Sharing",
      Difficulty: "Easy",
      Question_Type: "Habit",
      Question_Text: "What do you usually do with toys, books or clothes you no longer use but which are still in good condition?",
      Option_A: "Reuse, donate or share them",
      Option_B: "Sometimes reuse or share them",
      Option_C: "Rarely reuse or share them",
      Option_D: "Usually throw them away",
      Explanation: "Sharing, donating and reusing useful items can extend their life.",
      Green_Points: 10,
      Sort_Order: 7,
      Status: "Active",
      Assessment_Dimension: "Sustainable Habits",
      Topic_ID: "CIRCULAR_ECONOMY",
      Competency_ID: "REUSE_BEHAVIOUR",
      Maximum_Points: 10,
      Interaction_Idea: "Toy or book travels to a sharing station and finds a new home.",
      sceneType: "circular_loop"
    },
    {
      Question_ID: "KID008",
      Age_Group: "8-10",
      Category: "Waste & Recycling",
      Sub_Category: "Avoiding Single-use Plastic",
      Difficulty: "Easy",
      Question_Type: "Habit",
      Question_Text: "How often do you avoid unnecessary single-use plastic items?",
      Option_A: "Always",
      Option_B: "Sometimes",
      Option_C: "Rarely",
      Option_D: "Never",
      Explanation: "Choosing reusable alternatives can reduce single-use plastic waste.",
      Green_Points: 10,
      Sort_Order: 8,
      Status: "Active",
      Assessment_Dimension: "Sustainable Habits",
      Topic_ID: "WASTE_&_RECYCLING",
      Competency_ID: "PLASTIC_REDUCTION",
      Maximum_Points: 10,
      Interaction_Idea: "Plastic meter decreases as reusable alternatives appear.",
      sceneType: "waste_bins"
    },
    {
      Question_ID: "KID009",
      Age_Group: "8-10",
      Category: "Waste & Recycling",
      Sub_Category: "Littering",
      Difficulty: "Easy",
      Question_Type: "Scenario",
      Question_Text: "Your friends leave snack wrappers on the playground. What would you do?",
      Option_A: "Put your wrapper in the correct bin and encourage them to do the same",
      Option_B: "Put your wrapper in the bin but say nothing",
      Option_C: "Ignore the litter",
      Option_D: "Throw your wrapper on the ground too",
      Explanation: "Using the correct bin and encouraging others helps keep shared spaces clean.",
      Green_Points: 10,
      Sort_Order: 9,
      Status: "Active",
      Assessment_Dimension: "Decision-making",
      Topic_ID: "WASTE_&_RECYCLING",
      Competency_ID: "RESPONSIBLE_WASTE",
      Maximum_Points: 10,
      Interaction_Idea: "Playground cleanup mission; wrappers move into bins.",
      sceneType: "waste_bins"
    },
    {
      Question_ID: "KID010",
      Age_Group: "8-10",
      Category: "Water Conservation",
      Sub_Category: "Reporting a Leak",
      Difficulty: "Easy",
      Question_Type: "Scenario",
      Question_Text: "You notice a tap leaking at school. What would you do?",
      Option_A: "Inform a teacher or responsible adult immediately",
      Option_B: "Turn it off if safe and possible",
      Option_C: "Ignore it for now",
      Option_D: "Play with the running water",
      Explanation: "Reporting or safely stopping a leak helps prevent water waste.",
      Green_Points: 10,
      Sort_Order: 10,
      Status: "Active",
      Assessment_Dimension: "Decision-making",
      Topic_ID: "WATER_CONSERVATION",
      Competency_ID: "WATER_ACTION",
      Maximum_Points: 10,
      Interaction_Idea: "Water detective finds and fixes a leaking tap.",
      sceneType: "water_tap"
    },
    {
      Question_ID: "KID011",
      Age_Group: "8-10",
      Category: "Green Transport",
      Sub_Category: "Low-emission Travel",
      Difficulty: "Easy",
      Question_Type: "Scenario",
      Question_Text: "Your school is nearby and it is safe to walk with an adult. What would be a greener choice?",
      Option_A: "Walk together",
      Option_B: "Cycle with an adult, if safe",
      Option_C: "Travel by car",
      Option_D: "Take a separate car for a very short journey when other options are practical",
      Explanation: "Walking or cycling where safe can avoid direct vehicle emissions.",
      Green_Points: 10,
      Sort_Order: 11,
      Status: "Active",
      Assessment_Dimension: "Decision-making",
      Topic_ID: "GREEN_TRANSPORT",
      Competency_ID: "TRANSPORT_CHOICE",
      Maximum_Points: 10,
      Interaction_Idea: "Animated road compares walking, cycling and vehicle traffic.",
      sceneType: "transport_road"
    },
    {
      Question_ID: "KID012",
      Age_Group: "8-10",
      Category: "Food Sustainability",
      Sub_Category: "Leftover Food",
      Difficulty: "Easy",
      Question_Type: "Scenario",
      Question_Text: "Your family has leftover food after dinner. What is a thoughtful choice if the food is safe to eat?",
      Option_A: "Store it safely for another meal",
      Option_B: "Share it with someone who can use it",
      Option_C: "Leave it uncovered",
      Option_D: "Throw it away immediately",
      Explanation: "Safe storage or sharing can prevent edible food from being wasted.",
      Green_Points: 10,
      Sort_Order: 12,
      Status: "Active",
      Assessment_Dimension: "Decision-making",
      Topic_ID: "FOOD_SUSTAINABILITY",
      Competency_ID: "FOOD_WASTE_ACTION",
      Maximum_Points: 10,
      Interaction_Idea: "Food rescue mission with storage containers and sharing basket.",
      sceneType: "food_plate"
    },
    {
      Question_ID: "KID013",
      Age_Group: "8-10",
      Category: "Circular Economy",
      Sub_Category: "Repairing Items",
      Difficulty: "Easy",
      Question_Type: "Scenario",
      Question_Text: "Your favourite toy has a small broken part. What would you do?",
      Option_A: "Ask an adult to help repair it",
      Option_B: "Try to reuse its working parts safely",
      Option_C: "Keep it unused without considering repair",
      Option_D: "Throw it away immediately and buy a new one",
      Explanation: "Repairing or reusing can extend a product's useful life.",
      Green_Points: 10,
      Sort_Order: 13,
      Status: "Active",
      Assessment_Dimension: "Decision-making",
      Topic_ID: "CIRCULAR_ECONOMY",
      Competency_ID: "REPAIR_REUSE",
      Maximum_Points: 10,
      Interaction_Idea: "Repair workshop restores a toy.",
      sceneType: "circular_loop"
    },
    {
      Question_ID: "KID014",
      Age_Group: "8-10",
      Category: "Sustainable Purchasing",
      Sub_Category: "Shopping Choices",
      Difficulty: "Easy",
      Question_Type: "Scenario",
      Question_Text: "You are shopping with your family. Which choice helps reduce waste?",
      Option_A: "Carry reusable shopping bags",
      Option_B: "Reuse a clean bag already available",
      Option_C: "Take a new bag even when one is available",
      Option_D: "Ask for several unnecessary disposable bags",
      Explanation: "Reusable bags reduce demand for disposable bags.",
      Green_Points: 10,
      Sort_Order: 14,
      Status: "Active",
      Assessment_Dimension: "Decision-making",
      Topic_ID: "SUSTAINABLE_PURCHASING",
      Competency_ID: "LOW_WASTE_PURCHASING",
      Maximum_Points: 10,
      Interaction_Idea: "Shopping basket makeover with reusable bags.",
      sceneType: "circular_loop"
    },
    {
      Question_ID: "KID015",
      Age_Group: "8-10",
      Category: "Nature & Biodiversity",
      Sub_Category: "Wildlife Respect",
      Difficulty: "Easy",
      Question_Type: "Scenario",
      Question_Text: "You see a butterfly resting on a flower. What would you do?",
      Option_A: "Observe it without disturbing it",
      Option_B: "Take a photograph from a distance",
      Option_C: "Touch it without knowing whether it is safe",
      Option_D: "Catch it and keep it in a jar",
      Explanation: "Observing wildlife without disturbing it helps protect living things.",
      Green_Points: 10,
      Sort_Order: 15,
      Status: "Active",
      Assessment_Dimension: "Decision-making",
      Topic_ID: "NATURE_&_BIODIVERSITY",
      Competency_ID: "WILDLIFE_PROTECTION",
      Maximum_Points: 10,
      Interaction_Idea: "Butterflies fly around a garden when wildlife-friendly choices are made.",
      sceneType: "nature_garden"
    },
    {
      Question_ID: "KID016",
      Age_Group: "8-10",
      Category: "Nature & Biodiversity",
      Sub_Category: "Why Trees Matter",
      Difficulty: "Easy",
      Question_Type: "Knowledge",
      Question_Text: "Why are trees important for our planet?",
      Option_A: "They absorb carbon dioxide and provide habitats",
      Option_B: "They create plastic",
      Option_C: "They make rivers salty",
      Option_D: "They stop all rain",
      Explanation: "Trees store carbon and provide habitats for many living things.",
      Green_Points: 10,
      Sort_Order: 16,
      Status: "Active",
      Assessment_Dimension: "Environmental Awareness",
      Topic_ID: "NATURE_&_BIODIVERSITY",
      Competency_ID: "TREE_BENEFITS",
      Maximum_Points: 10,
      Interaction_Idea: "Tree animation shows carbon dioxide uptake and habitat growth.",
      sceneType: "nature_garden"
    },
    {
      Question_ID: "KID017",
      Age_Group: "8-10",
      Category: "Energy Conservation",
      Sub_Category: "Renewable Energy",
      Difficulty: "Easy",
      Question_Type: "Knowledge",
      Question_Text: "Which of these is a renewable energy source?",
      Option_A: "Coal",
      Option_B: "Petrol",
      Option_C: "Solar energy",
      Option_D: "Diesel",
      Explanation: "Solar energy comes from sunlight and is naturally replenished.",
      Green_Points: 10,
      Sort_Order: 17,
      Status: "Active",
      Assessment_Dimension: "Environmental Awareness",
      Topic_ID: "ENERGY_CONSERVATION",
      Competency_ID: "RENEWABLE_ENERGY",
      Maximum_Points: 10,
      Interaction_Idea: "Solar panels power a small animated house.",
      sceneType: "energy_switch"
    },
    {
      Question_ID: "KID018",
      Age_Group: "8-10",
      Category: "Climate Awareness",
      Sub_Category: "Climate Change",
      Difficulty: "Easy",
      Question_Type: "Knowledge",
      Question_Text: "What does climate change mean?",
      Option_A: "A change in the weather for one hour",
      Option_B: "Long-term changes in Earth's temperatures and weather patterns",
      Option_C: "The arrival of night",
      Option_D: "A rainy afternoon",
      Explanation: "Climate change refers to long-term shifts in temperatures and weather patterns.",
      Green_Points: 10,
      Sort_Order: 18,
      Status: "Active",
      Assessment_Dimension: "Environmental Awareness",
      Topic_ID: "CLIMATE_AWARENESS",
      Competency_ID: "CLIMATE_BASICS",
      Maximum_Points: 10,
      Interaction_Idea: "Earth explorer shows changing temperatures over many years.",
      sceneType: "climate_earth"
    },
    {
      Question_ID: "KID019",
      Age_Group: "8-10",
      Category: "Waste & Recycling",
      Sub_Category: "Composting",
      Difficulty: "Easy",
      Question_Type: "Knowledge",
      Question_Text: "Which of these can naturally break down and become compost?",
      Option_A: "Plastic wrapper",
      Option_B: "Glass bottle",
      Option_C: "Banana peel",
      Option_D: "Metal can",
      Explanation: "Fruit and vegetable scraps can decompose and become compost.",
      Green_Points: 10,
      Sort_Order: 19,
      Status: "Active",
      Assessment_Dimension: "Environmental Awareness",
      Topic_ID: "WASTE_&_RECYCLING",
      Competency_ID: "COMPOSTING",
      Maximum_Points: 10,
      Interaction_Idea: "Banana peel transforms into compost and helps a plant grow.",
      sceneType: "waste_bins"
    },
    {
      Question_ID: "KID020",
      Age_Group: "8-10",
      Category: "Waste & Recycling",
      Sub_Category: "Recycling",
      Difficulty: "Easy",
      Question_Type: "Knowledge",
      Question_Text: "What is the best thing to do with a clean, recyclable plastic bottle?",
      Option_A: "Put it in the appropriate recycling collection",
      Option_B: "Throw it into a river",
      Option_C: "Burn it",
      Option_D: "Leave it on the road",
      Explanation: "Follow local recycling guidance and use the appropriate collection point.",
      Green_Points: 10,
      Sort_Order: 20,
      Status: "Active",
      Assessment_Dimension: "Environmental Awareness",
      Topic_ID: "WASTE_&_RECYCLING",
      Competency_ID: "RECYCLING",
      Maximum_Points: 10,
      Interaction_Idea: "Bottle travels through a recycling journey to become a new product.",
      sceneType: "waste_bins"
    },
    {
      Question_ID: "KID021",
      Age_Group: "8-10",
      Category: "Nature & Biodiversity",
      Sub_Category: "Pollination",
      Difficulty: "Easy",
      Question_Type: "Knowledge",
      Question_Text: "Why are bees important for nature?",
      Option_A: "They help pollinate many plants",
      Option_B: "They make plastic",
      Option_C: "They create air pollution",
      Option_D: "They stop plants from growing",
      Explanation: "Bees pollinate many plants, helping ecosystems and food production.",
      Green_Points: 10,
      Sort_Order: 21,
      Status: "Active",
      Assessment_Dimension: "Environmental Awareness",
      Topic_ID: "NATURE_&_BIODIVERSITY",
      Competency_ID: "POLLINATION",
      Maximum_Points: 10,
      Interaction_Idea: "Bee moves between flowers and helps a garden bloom.",
      sceneType: "nature_garden"
    },
    {
      Question_ID: "KID022",
      Age_Group: "8-10",
      Category: "Energy Conservation",
      Sub_Category: "Home Energy Choices",
      Difficulty: "Easy",
      Question_Type: "Application",
      Question_Text: "Your family wants to save electricity. Which action would you suggest?",
      Option_A: "Switch off unused lights and fans",
      Option_B: "Use daylight whenever possible",
      Option_C: "Keep the television on in an empty room",
      Option_D: "Leave every appliance running",
      Explanation: "Switching off unused appliances and making use of daylight can reduce electricity use.",
      Green_Points: 10,
      Sort_Order: 22,
      Status: "Active",
      Assessment_Dimension: "Practical Application",
      Topic_ID: "ENERGY_CONSERVATION",
      Competency_ID: "ENERGY_ACTION",
      Maximum_Points: 10,
      Interaction_Idea: "Interactive home energy meter responds to choices.",
      sceneType: "energy_switch"
    },
    {
      Question_ID: "KID023",
      Age_Group: "8-10",
      Category: "Waste & Recycling",
      Sub_Category: "School Waste Plan",
      Difficulty: "Easy",
      Question_Type: "Application",
      Question_Text: "Your school wants to reduce waste. What would be a good idea?",
      Option_A: "Introduce labelled waste bins and explain how to use them",
      Option_B: "Encourage students to reuse paper",
      Option_C: "Put all waste into one bin without sorting",
      Option_D: "Throw waste in the playground",
      Explanation: "Clear waste sorting and reuse activities can reduce waste sent for disposal.",
      Green_Points: 10,
      Sort_Order: 23,
      Status: "Active",
      Assessment_Dimension: "Practical Application",
      Topic_ID: "WASTE_&_RECYCLING",
      Competency_ID: "SCHOOL_WASTE_ACTION",
      Maximum_Points: 10,
      Interaction_Idea: "Build a clean classroom with recycling and reuse stations.",
      sceneType: "waste_bins"
    },
    {
      Question_ID: "KID024",
      Age_Group: "8-10",
      Category: "Water Conservation",
      Sub_Category: "Home Water Plan",
      Difficulty: "Easy",
      Question_Type: "Application",
      Question_Text: "Your family wants to reduce water wastage. Which action would you suggest?",
      Option_A: "Fix leaking taps and turn off unused taps",
      Option_B: "Use a bucket instead of a running hose when appropriate",
      Option_C: "Leave taps running while doing other activities",
      Option_D: "Ignore leaking taps",
      Explanation: "Fixing leaks and avoiding unnecessary running water can save water.",
      Green_Points: 10,
      Sort_Order: 24,
      Status: "Active",
      Assessment_Dimension: "Practical Application",
      Topic_ID: "WATER_CONSERVATION",
      Competency_ID: "WATER_ACTION",
      Maximum_Points: 10,
      Interaction_Idea: "Water-saving dashboard displays simulated savings.",
      sceneType: "water_tap"
    },
    {
      Question_ID: "KID025",
      Age_Group: "8-10",
      Category: "Climate Awareness",
      Sub_Category: "School Green Day",
      Difficulty: "Easy",
      Question_Type: "Application",
      Question_Text: "Your class is planning a Green Day. Which activity would make a positive contribution?",
      Option_A: "Plant and care for suitable native species",
      Option_B: "Organise a waste segregation and recycling drive",
      Option_C: "Decorate with disposable plastic decorations",
      Option_D: "Distribute single-use plastic items",
      Explanation: "Tree care and waste reduction can support a more sustainable school environment.",
      Green_Points: 10,
      Sort_Order: 25,
      Status: "Active",
      Assessment_Dimension: "Practical Application",
      Topic_ID: "CLIMATE_AWARENESS",
      Competency_ID: "SCHOOL_SUSTAINABILITY",
      Maximum_Points: 10,
      Interaction_Idea: "School environment transforms through the selected green mission.",
      sceneType: "nature_garden"
    }
  ];

  const RAW_KIDS_QUESTIONS_11_14 = [
    {
      Question_ID: "YA006",
      Age_Group: "11-14",
      Category: "Water Conservation",
      Sub_Category: "Water Use",
      Difficulty: "Medium",
      Question_Type: "Habit",
      Question_Text: "How consistently do you avoid unnecessary water use at home?",
      Option_A: "Always turn off taps and avoid unnecessary water use",
      Option_B: "Usually conserve water but occasionally forget",
      Option_C: "Rarely pay attention to water usage",
      Option_D: "Never consider water conservation",
      Explanation: "Conserving water includes avoiding unnecessary use and reporting leaks.",
      Green_Points: 10,
      Sort_Order: 1,
      Status: "Active",
      Assessment_Dimension: "Sustainable Habits",
      Topic_ID: "WATER_CONSERVATION",
      Competency_ID: "WATER_BEHAVIOUR",
      Maximum_Points: 10,
      Interaction_Idea: "Water meter challenge with a simulated household water tank.",
      sceneType: "water_tap"
    },
    {
      Question_ID: "YA007",
      Age_Group: "11-14",
      Category: "Energy Conservation",
      Sub_Category: "Energy Efficiency",
      Difficulty: "Medium",
      Question_Type: "Habit",
      Question_Text: "How often do you switch off electrical appliances when they are not required?",
      Option_A: "Always",
      Option_B: "Sometimes",
      Option_C: "Rarely",
      Option_D: "Never",
      Explanation: "Switching off unused appliances can reduce electricity consumption.",
      Green_Points: 10,
      Sort_Order: 2,
      Status: "Active",
      Assessment_Dimension: "Sustainable Habits",
      Topic_ID: "ENERGY_CONSERVATION",
      Competency_ID: "ENERGY_BEHAVIOUR",
      Maximum_Points: 10,
      Interaction_Idea: "Smart-home dashboard with appliance controls and energy meter.",
      sceneType: "energy_switch"
    },
    {
      Question_ID: "YA008",
      Age_Group: "11-14",
      Category: "Waste & Recycling",
      Sub_Category: "Reusable Alternatives",
      Difficulty: "Medium",
      Question_Type: "Habit",
      Question_Text: "How often do you choose reusable alternatives instead of single-use products?",
      Option_A: "Almost always",
      Option_B: "Sometimes",
      Option_C: "Rarely",
      Option_D: "Never",
      Explanation: "Reusable alternatives can reduce demand for disposable products.",
      Green_Points: 10,
      Sort_Order: 3,
      Status: "Active",
      Assessment_Dimension: "Sustainable Habits",
      Topic_ID: "WASTE_&_RECYCLING",
      Competency_ID: "PLASTIC_REDUCTION",
      Maximum_Points: 10,
      Interaction_Idea: "Plastic footprint comparison with reusable items.",
      sceneType: "waste_bins"
    },
    {
      Question_ID: "YA009",
      Age_Group: "11-14",
      Category: "Food Sustainability",
      Sub_Category: "Food Waste Management",
      Difficulty: "Medium",
      Question_Type: "Habit",
      Question_Text: "How consistently do you prevent food from being wasted?",
      Option_A: "Always plan portions and avoid wasting food",
      Option_B: "Sometimes take more food than needed",
      Option_C: "Frequently leave food unfinished",
      Option_D: "Regularly waste food without considering alternatives",
      Explanation: "Portion planning and safe storage can reduce food waste.",
      Green_Points: 10,
      Sort_Order: 4,
      Status: "Active",
      Assessment_Dimension: "Sustainable Habits",
      Topic_ID: "FOOD_SUSTAINABILITY",
      Competency_ID: "FOOD_WASTE_BEHAVIOUR",
      Maximum_Points: 10,
      Interaction_Idea: "Meal-planning challenge with food-waste meter.",
      sceneType: "food_plate"
    },
    {
      Question_ID: "YA010",
      Age_Group: "11-14",
      Category: "Circular Economy",
      Sub_Category: "Repair and Reuse",
      Difficulty: "Medium",
      Question_Type: "Habit",
      Question_Text: "What do you usually do with products that are still usable but no longer needed?",
      Option_A: "Repair, reuse, donate or share them (give them a second life)",
      Option_B: "Sometimes find another use for them",
      Option_C: "Rarely consider reuse",
      Option_D: "Usually discard them immediately (throw them away right away)",
      Explanation: "Repairing, sharing and reusing can extend product life.",
      Green_Points: 10,
      Sort_Order: 5,
      Status: "Active",
      Assessment_Dimension: "Sustainable Habits",
      Topic_ID: "CIRCULAR_ECONOMY",
      Competency_ID: "REUSE_BEHAVIOUR",
      Maximum_Points: 10,
      Interaction_Idea: "Circular economy journey showing product reuse.",
      sceneType: "circular_loop"
    },
    {
      Question_ID: "YA011",
      Age_Group: "11-14",
      Category: "Sustainable Purchasing",
      Sub_Category: "Responsible Buying",
      Difficulty: "Medium",
      Question_Type: "Habit",
      Question_Text: "When buying school supplies, how often do you consider reusing existing items or avoiding unnecessary packaging?",
      Option_A: "Always (I check what I already have at home first)",
      Option_B: "Sometimes (I reuse a few items from last year)",
      Option_C: "Rarely (I mostly buy brand-new supplies)",
      Option_D: "Never (I buy new items without checking)",
      Explanation: "Considering need, durability and packaging can reduce unnecessary consumption.",
      Green_Points: 10,
      Sort_Order: 6,
      Status: "Active",
      Assessment_Dimension: "Sustainable Habits",
      Topic_ID: "SUSTAINABLE_PURCHASING",
      Competency_ID: "LOW_WASTE_PURCHASING",
      Maximum_Points: 10,
      Interaction_Idea: "Virtual shopping comparison with packaging and durability indicators.",
      sceneType: "circular_loop"
    },
    {
      Question_ID: "YA012",
      Age_Group: "11-14",
      Category: "Nature & Biodiversity",
      Sub_Category: "Biodiversity Protection",
      Difficulty: "Medium",
      Question_Type: "Habit",
      Question_Text: "How often do you take steps to protect plants, wildlife and natural habitats?",
      Option_A: "Regularly participate in nature-friendly activities",
      Option_B: "Sometimes take part",
      Option_C: "Rarely participate",
      Option_D: "Never consider it",
      Explanation: "Nature-friendly activities can support biodiversity and habitats.",
      Green_Points: 10,
      Sort_Order: 7,
      Status: "Active",
      Assessment_Dimension: "Sustainable Habits",
      Topic_ID: "NATURE_&_BIODIVERSITY",
      Competency_ID: "BIODIVERSITY_BEHAVIOUR",
      Maximum_Points: 10,
      Interaction_Idea: "Restore a virtual ecosystem by protecting habitats and wildlife.",
      sceneType: "nature_garden"
    },
    {
      Question_ID: "YA013",
      Age_Group: "11-14",
      Category: "Digital Sustainability",
      Sub_Category: "Responsible Device Use",
      Difficulty: "Medium",
      Question_Type: "Habit",
      Question_Text: "How often do you switch off devices when they are not required, where safe and appropriate?",
      Option_A: "Always",
      Option_B: "Sometimes",
      Option_C: "Rarely",
      Option_D: "Never",
      Explanation: "Turning off unused devices can reduce electricity use. Digital services also have indirect impacts, but these require separate data to estimate.",
      Green_Points: 10,
      Sort_Order: 8,
      Status: "Active",
      Assessment_Dimension: "Sustainable Habits",
      Topic_ID: "DIGITAL_SUSTAINABILITY",
      Competency_ID: "DIGITAL_BEHAVIOUR",
      Maximum_Points: 10,
      Interaction_Idea: "Digital energy dashboard in a virtual study room.",
      sceneType: "energy_switch"
    },
    {
      Question_ID: "YA014",
      Age_Group: "11-14",
      Category: "Waste & Recycling",
      Sub_Category: "School Waste Management",
      Difficulty: "Medium",
      Question_Type: "Scenario",
      Question_Text: "Your school discovers that recyclable paper and plastic are mixed with food waste. What would you recommend?",
      Option_A: "Introduce labelled segregation bins (separate wet & dry bins) and awareness activities",
      Option_B: "Introduce separate bins without explaining their purpose",
      Option_C: "Ask housekeeping staff (school cleaning staff) to handle everything without changing student practices",
      Option_D: "Continue disposing of everything together",
      Explanation: "Clear labels and awareness help people sort waste correctly.",
      Green_Points: 10,
      Sort_Order: 9,
      Status: "Active",
      Assessment_Dimension: "Decision-making",
      Topic_ID: "WASTE_&_RECYCLING",
      Competency_ID: "RESPONSIBLE_WASTE",
      Maximum_Points: 10,
      Interaction_Idea: "Drag-and-drop waste sorting and school bin layout challenge.",
      sceneType: "waste_bins"
    },
    {
      Question_ID: "YA015",
      Age_Group: "11-14",
      Category: "Green Transport",
      Sub_Category: "Shared Travel",
      Difficulty: "Medium",
      Question_Type: "Scenario",
      Question_Text: "Your friends are travelling to the same event. Which arrangement would generally reduce transport emissions?",
      Option_A: "Share a vehicle or use public transport where practical",
      Option_B: "Walk or cycle if the destination is safely accessible",
      Option_C: "Travel separately in individual cars",
      Option_D: "Take separate vehicles even though shared transport is available",
      Explanation: "Shared or active travel can reduce emissions per passenger when practical and safe.",
      Green_Points: 10,
      Sort_Order: 10,
      Status: "Active",
      Assessment_Dimension: "Decision-making",
      Topic_ID: "GREEN_TRANSPORT",
      Competency_ID: "TRANSPORT_CHOICE",
      Maximum_Points: 10,
      Interaction_Idea: "Transport comparison simulator showing occupancy and per-passenger estimates.",
      sceneType: "transport_road"
    },
    {
      Question_ID: "YA016",
      Age_Group: "11-14",
      Category: "Food Sustainability",
      Sub_Category: "Cafeteria Food Waste",
      Difficulty: "Medium",
      Question_Type: "Scenario",
      Question_Text: "Your school cafeteria throws away large quantities of uneaten food. What would be your first recommendation?",
      Option_A: "Study the waste pattern, adjust portions and improve meal planning",
      Option_B: "Encourage students to take smaller portions and take more if needed",
      Option_C: "Only put up posters asking students not to waste food",
      Option_D: "Ignore the problem",
      Explanation: "Measuring the waste and adjusting portions can address causes of food waste.",
      Green_Points: 10,
      Sort_Order: 11,
      Status: "Active",
      Assessment_Dimension: "Decision-making",
      Topic_ID: "FOOD_SUSTAINABILITY",
      Competency_ID: "FOOD_WASTE_ACTION",
      Maximum_Points: 10,
      Interaction_Idea: "Cafeteria investigation game identifies food-waste hotspots.",
      sceneType: "food_plate"
    },
    {
      Question_ID: "YA017",
      Age_Group: "11-14",
      Category: "Circular Economy",
      Sub_Category: "Repair or Replace",
      Difficulty: "Medium",
      Question_Type: "Scenario",
      Question_Text: "Your family laptop is working slowly but can still be repaired. What would be a more sustainable decision?",
      Option_A: "Explore repair or upgrading before replacing it",
      Option_B: "Ask a technician whether extending its life is practical",
      Option_C: "Buy a new device without checking repair options",
      Option_D: "Throw the laptop away without proper e-waste disposal",
      Explanation: "Repairing or extending a device's useful life can avoid premature replacement.",
      Green_Points: 10,
      Sort_Order: 12,
      Status: "Active",
      Assessment_Dimension: "Decision-making",
      Topic_ID: "CIRCULAR_ECONOMY",
      Competency_ID: "REPAIR_REUSE",
      Maximum_Points: 10,
      Interaction_Idea: "Electronic device lifecycle simulation compares repair and replacement.",
      sceneType: "circular_loop"
    },
    {
      Question_ID: "YA018",
      Age_Group: "11-14",
      Category: "Water Conservation",
      Sub_Category: "Water Shortage",
      Difficulty: "Medium",
      Question_Type: "Scenario",
      Question_Text: "Your neighbourhood experiences water shortages. Which action would make a practical contribution?",
      Option_A: "Identify wastage, report leaks and encourage water-saving practices",
      Option_B: "Reduce unnecessary water usage at home",
      Option_C: "Only save water when shortages become severe",
      Option_D: "Continue using water without considering the shortage",
      Explanation: "Combining personal conservation with reporting leaks can help address water wastage.",
      Green_Points: 10,
      Sort_Order: 13,
      Status: "Active",
      Assessment_Dimension: "Decision-making",
      Topic_ID: "WATER_CONSERVATION",
      Competency_ID: "WATER_ACTION",
      Maximum_Points: 10,
      Interaction_Idea: "Neighbourhood water management simulator.",
      sceneType: "water_tap"
    },
    {
      Question_ID: "YA019",
      Age_Group: "11-14",
      Category: "Sustainable Purchasing",
      Sub_Category: "Product Choice",
      Difficulty: "Medium",
      Question_Type: "Scenario",
      Question_Text: "You need a new school bag. Which choice would you consider most sustainable?",
      Option_A: "Use your existing bag if it is still in good condition",
      Option_B: "Choose a durable product with suitable materials and less packaging",
      Option_C: "Buy a new bag mainly because it is fashionable",
      Option_D: "Buy several bags unnecessarily",
      Explanation: "Avoiding unnecessary purchases and choosing durable products can reduce resource demand.",
      Green_Points: 10,
      Sort_Order: 14,
      Status: "Active",
      Assessment_Dimension: "Decision-making",
      Topic_ID: "SUSTAINABLE_PURCHASING",
      Competency_ID: "LOW_WASTE_PURCHASING",
      Maximum_Points: 10,
      Interaction_Idea: "Product comparison with durability and packaging indicators.",
      sceneType: "circular_loop"
    },
    {
      Question_ID: "YA020",
      Age_Group: "11-14",
      Category: "Nature & Biodiversity",
      Sub_Category: "Protecting Green Spaces",
      Difficulty: "Medium",
      Question_Type: "Scenario",
      Question_Text: "A natural green space near your school is being littered. What would you propose?",
      Option_A: "Organise a cleanup with adult supervision and awareness activities",
      Option_B: "Inform the responsible local authority or school",
      Option_C: "Clean only visible litter without addressing the cause",
      Option_D: "Ignore the problem",
      Explanation: "Cleanup, reporting and awareness can help protect shared natural spaces.",
      Green_Points: 10,
      Sort_Order: 15,
      Status: "Active",
      Assessment_Dimension: "Decision-making",
      Topic_ID: "NATURE_&_BIODIVERSITY",
      Competency_ID: "WILDLIFE_PROTECTION",
      Maximum_Points: 10,
      Interaction_Idea: "Restore a local ecosystem through cleanup and protection choices.",
      sceneType: "nature_garden"
    },
    {
      Question_ID: "YA021",
      Age_Group: "11-14",
      Category: "Climate Awareness",
      Sub_Category: "Greenhouse Effect",
      Difficulty: "Medium",
      Question_Type: "Knowledge",
      Question_Text: "How do greenhouse gases contribute to global warming?",
      Option_A: "They trap heat in the Earth's atmosphere (like a heat-trapping blanket around the planet)",
      Option_B: "They remove all heat from the atmosphere",
      Option_C: "They stop sunlight from reaching Earth completely",
      Option_D: "They turn oxygen into water",
      Explanation: "Greenhouse gases absorb and re-emit infrared radiation, contributing to warming.",
      Green_Points: 10,
      Sort_Order: 16,
      Status: "Active",
      Assessment_Dimension: "Environmental Awareness",
      Topic_ID: "CLIMATE_AWARENESS",
      Competency_ID: "GREENHOUSE_EFFECT",
      Maximum_Points: 10,
      Interaction_Idea: "Interactive Earth atmosphere shows incoming sunlight and outgoing heat.",
      sceneType: "emission_detective"
    },
    {
      Question_ID: "YA022",
      Age_Group: "11-14",
      Category: "Product Lifecycle",
      Sub_Category: "Product Carbon Footprint",
      Difficulty: "Medium",
      Question_Type: "Knowledge",
      Question_Text: "Why can a notebook have a carbon footprint even before you start using it?",
      Option_A: "Raw material extraction, manufacturing and transportation create emissions (making paper in factories and shipping)",
      Option_B: "Only using a notebook creates emissions",
      Option_C: "Notebooks automatically produce oxygen",
      Option_D: "Products have no environmental impact before purchase",
      Explanation: "Product footprints can include raw materials, manufacturing, transport, use and end of life.",
      Green_Points: 10,
      Sort_Order: 17,
      Status: "Active",
      Assessment_Dimension: "Environmental Awareness",
      Topic_ID: "PRODUCT_LIFECYCLE",
      Competency_ID: "PRODUCT_LIFECYCLE",
      Maximum_Points: 10,
      Interaction_Idea: "Notebook lifecycle journey from material to disposal.",
      sceneType: "emission_detective"
    },
    {
      Question_ID: "YA023",
      Age_Group: "11-14",
      Category: "Food Sustainability",
      Sub_Category: "Food Emissions",
      Difficulty: "Medium",
      Question_Type: "Knowledge",
      Question_Text: "Which activity can contribute to greenhouse gas emissions through food production?",
      Option_A: "Producing and transporting food using energy and resources (farm machines, processing factories, and delivery trucks)",
      Option_B: "Eating food without packaging (low-waste habit)",
      Option_C: "Drinking water from a reusable bottle (plastic-saving habit)",
      Option_D: "Growing a plant in a garden (absorbs CO₂)",
      Explanation: "Food systems can generate emissions through production, processing, transport and other stages.",
      Green_Points: 10,
      Sort_Order: 18,
      Status: "Active",
      Assessment_Dimension: "Environmental Awareness",
      Topic_ID: "FOOD_SUSTAINABILITY",
      Competency_ID: "FOOD_EMISSIONS",
      Maximum_Points: 10,
      Interaction_Idea: "Food journey simulation from farm to plate.",
      sceneType: "emission_detective"
    },
    {
      Question_ID: "YA024",
      Age_Group: "11-14",
      Category: "Circular Economy",
      Sub_Category: "Circular Economy",
      Difficulty: "Medium",
      Question_Type: "Knowledge",
      Question_Text: "What does a circular economy encourage?",
      Option_A: "Keeping products and materials in use through reuse, repair and recycling (a make-use-return loop)",
      Option_B: "Buying new products and throwing old ones away",
      Option_C: "Increasing unnecessary packaging",
      Option_D: "Sending all waste to landfill",
      Explanation: "A circular economy aims to reduce waste and keep materials and products in use.",
      Green_Points: 10,
      Sort_Order: 19,
      Status: "Active",
      Assessment_Dimension: "Environmental Awareness",
      Topic_ID: "CIRCULAR_ECONOMY",
      Competency_ID: "CIRCULAR_ECONOMY",
      Maximum_Points: 10,
      Interaction_Idea: "Circular economy loop with design, use, repair, reuse and recycling.",
      sceneType: "circular_loop"
    },
    {
      Question_ID: "YA025",
      Age_Group: "11-14",
      Category: "Carbon Literacy",
      Sub_Category: "Carbon Credits",
      Difficulty: "Medium",
      Question_Type: "Knowledge",
      Question_Text: "What is the purpose of a carbon credit?",
      Option_A: "It represents a quantified unit of greenhouse gas reduction or removal under a recognised crediting programme (1 credit = 1 verified unit of CO₂e reduced or removed)",
      Option_B: "It is a discount coupon for shopping",
      Option_C: "It allows anyone to pollute without limits",
      Option_D: "It is a type of electricity bill",
      Explanation: "Carbon credits represent quantified reductions or removals under a crediting programme; they do not replace direct emissions reductions.",
      Green_Points: 10,
      Sort_Order: 20,
      Status: "Active",
      Assessment_Dimension: "Environmental Awareness",
      Topic_ID: "CARBON_LITERACY",
      Competency_ID: "CARBON_CREDITS",
      Maximum_Points: 10,
      Interaction_Idea: "Carbon project explorer explains projects, quantified impact and credits.",
      sceneType: "climate_earth"
    },
    {
      Question_ID: "YA026",
      Age_Group: "11-14",
      Category: "Energy Conservation",
      Sub_Category: "Renewable Energy",
      Difficulty: "Medium",
      Question_Type: "Knowledge",
      Question_Text: "Which statement correctly describes renewable energy?",
      Option_A: "It comes from sources naturally replenished, such as sunlight and wind (clean energy that does not run out)",
      Option_B: "It comes only from coal and petroleum",
      Option_C: "It can never be used again",
      Option_D: "It always produces more emissions than fossil fuels",
      Explanation: "Solar and wind are examples of renewable energy sources.",
      Green_Points: 10,
      Sort_Order: 21,
      Status: "Active",
      Assessment_Dimension: "Environmental Awareness",
      Topic_ID: "ENERGY_CONSERVATION",
      Competency_ID: "RENEWABLE_ENERGY",
      Maximum_Points: 10,
      Interaction_Idea: "Compare solar, wind, coal and petroleum energy sources.",
      sceneType: "energy_switch"
    },
    {
      Question_ID: "YA027",
      Age_Group: "11-14",
      Category: "Energy Conservation",
      Sub_Category: "School Energy Audit",
      Difficulty: "Medium",
      Question_Type: "Application",
      Question_Text: "Your school wants to reduce electricity consumption. Which would be a useful first step?",
      Option_A: "Record energy use and identify where electricity is being wasted (conduct a school energy audit)",
      Option_B: "Switch off unnecessary lights and fans",
      Option_C: "Ask everyone to use fewer electronic devices without checking usage",
      Option_D: "Ignore the electricity consumption data",
      Explanation: "Measuring use and addressing avoidable consumption are practical energy-management steps.",
      Green_Points: 10,
      Sort_Order: 22,
      Status: "Active",
      Assessment_Dimension: "Practical Application",
      Topic_ID: "ENERGY_CONSERVATION",
      Competency_ID: "ENERGY_ACTION",
      Maximum_Points: 10,
      Interaction_Idea: "Energy audit game identifies wastage in a virtual classroom.",
      sceneType: "energy_switch"
    },
    {
      Question_ID: "YA028",
      Age_Group: "11-14",
      Category: "Food Sustainability",
      Sub_Category: "Low-Waste Lunch",
      Difficulty: "Medium",
      Question_Type: "Application",
      Question_Text: "You are preparing a school lunch. Which combination would help reduce waste?",
      Option_A: "Reusable lunchbox, reusable bottle and appropriate food portions",
      Option_B: "Reusable lunchbox and avoid unnecessary packaging",
      Option_C: "Disposable containers for every item",
      Option_D: "Multiple single-use plastic wrappers",
      Explanation: "Reusable containers and suitable portions can reduce packaging and food waste.",
      Green_Points: 10,
      Sort_Order: 23,
      Status: "Active",
      Assessment_Dimension: "Practical Application",
      Topic_ID: "FOOD_SUSTAINABILITY",
      Competency_ID: "LOW_WASTE_FOOD",
      Maximum_Points: 10,
      Interaction_Idea: "Build a sustainable lunchbox by dragging items into it.",
      sceneType: "food_plate"
    },
    {
      Question_ID: "YA029",
      Age_Group: "11-14",
      Category: "Climate Awareness",
      Sub_Category: "Measurable School Action",
      Difficulty: "Medium",
      Question_Type: "Application",
      Question_Text: "Your school wants to start a sustainability initiative. Which approach would create a more measurable outcome?",
      Option_A: "Set a baseline (starting measurement), choose a reduction target (saving goal) and track progress",
      Option_B: "Organise an awareness event and collect participation feedback (student responses)",
      Option_C: "Display sustainability posters without tracking activities",
      Option_D: "Announce a campaign without taking action",
      Explanation: "A baseline and measurable target help track whether an initiative is effective.",
      Green_Points: 10,
      Sort_Order: 24,
      Status: "Active",
      Assessment_Dimension: "Practical Application",
      Topic_ID: "CLIMATE_AWARENESS",
      Competency_ID: "MEASURABLE_ACTION",
      Maximum_Points: 10,
      Interaction_Idea: "Build a mini school sustainability dashboard with targets and progress.",
      sceneType: "climate_earth"
    },
    {
      Question_ID: "YA030",
      Age_Group: "11-14",
      Category: "Sustainable Lifestyle",
      Sub_Category: "Personal Action Plan",
      Difficulty: "Medium",
      Question_Type: "Application",
      Question_Text: "You want to reduce your environmental impact over the next month. What is the best approach?",
      Option_A: "Choose measurable actions (specific steps you can count), track them and review your progress",
      Option_B: "Pick a few actions but track them occasionally",
      Option_C: "Make a general promise without deciding what to do",
      Option_D: "Ignore your habits and make no changes",
      Explanation: "Specific actions and progress tracking make sustainability goals more practical.",
      Green_Points: 10,
      Sort_Order: 25,
      Status: "Active",
      Assessment_Dimension: "Practical Application",
      Topic_ID: "SUSTAINABLE_LIFESTYLE",
      Competency_ID: "PERSONAL_ACTION_PLAN",
      Maximum_Points: 10,
      Interaction_Idea: "Create a 30-day personal Green Challenge.",
      sceneType: "climate_earth"
    }
  ];

  // =========================================================================
  // 2. SEALED SCORING MATRIX (Never exposed on public question objects)
  //    Exact Option_A_Score..Option_D_Score from My_Carbon_Credit_Research_Template.xlsx
  // =========================================================================
  const SEALED_OPTION_SCORES = Object.freeze({
    // Explorer Mode (8-10)
    KID001: { A: 10, B: 7, C: 4, D: 0, max: 10, dim: "Sustainable Habits", cat: "Water Conservation" },
    KID002: { A: 10, B: 7, C: 4, D: 0, max: 10, dim: "Sustainable Habits", cat: "Water Conservation" },
    KID003: { A: 10, B: 7, C: 4, D: 0, max: 10, dim: "Sustainable Habits", cat: "Energy Conservation" },
    KID004: { A: 10, B: 7, C: 4, D: 0, max: 10, dim: "Sustainable Habits", cat: "Waste & Recycling" },
    KID005: { A: 10, B: 7, C: 4, D: 0, max: 10, dim: "Sustainable Habits", cat: "Food Sustainability" },
    KID006: { A: 10, B: 7, C: 4, D: 0, max: 10, dim: "Sustainable Habits", cat: "Nature & Biodiversity" },
    KID007: { A: 10, B: 7, C: 4, D: 0, max: 10, dim: "Sustainable Habits", cat: "Circular Economy" },
    KID008: { A: 10, B: 7, C: 4, D: 0, max: 10, dim: "Sustainable Habits", cat: "Waste & Recycling" },
    KID009: { A: 10, B: 7, C: 4, D: 0, max: 10, dim: "Decision-making", cat: "Waste & Recycling" },
    KID010: { A: 10, B: 10, C: 4, D: 0, max: 10, dim: "Decision-making", cat: "Water Conservation" },
    KID011: { A: 10, B: 10, C: 4, D: 0, max: 10, dim: "Decision-making", cat: "Green Transport" },
    KID012: { A: 10, B: 10, C: 4, D: 0, max: 10, dim: "Decision-making", cat: "Food Sustainability" },
    KID013: { A: 10, B: 7, C: 4, D: 0, max: 10, dim: "Decision-making", cat: "Circular Economy" },
    KID014: { A: 10, B: 10, C: 4, D: 0, max: 10, dim: "Decision-making", cat: "Sustainable Purchasing" },
    KID015: { A: 10, B: 10, C: 4, D: 0, max: 10, dim: "Decision-making", cat: "Nature & Biodiversity" },
    KID016: { A: 10, B: 0, C: 0, D: 0, max: 10, dim: "Environmental Awareness", cat: "Nature & Biodiversity" },
    KID017: { A: 0, B: 0, C: 10, D: 0, max: 10, dim: "Environmental Awareness", cat: "Energy Conservation" },
    KID018: { A: 0, B: 10, C: 0, D: 0, max: 10, dim: "Environmental Awareness", cat: "Climate Awareness" },
    KID019: { A: 0, B: 0, C: 10, D: 0, max: 10, dim: "Environmental Awareness", cat: "Waste & Recycling" },
    KID020: { A: 10, B: 0, C: 0, D: 0, max: 10, dim: "Environmental Awareness", cat: "Waste & Recycling" },
    KID021: { A: 10, B: 0, C: 0, D: 0, max: 10, dim: "Environmental Awareness", cat: "Nature & Biodiversity" },
    KID022: { A: 10, B: 10, C: 0, D: 0, max: 10, dim: "Practical Application", cat: "Energy Conservation" },
    KID023: { A: 10, B: 10, C: 4, D: 0, max: 10, dim: "Practical Application", cat: "Waste & Recycling" },
    KID024: { A: 10, B: 10, C: 0, D: 0, max: 10, dim: "Practical Application", cat: "Water Conservation" },
    KID025: { A: 10, B: 10, C: 0, D: 0, max: 10, dim: "Practical Application", cat: "Climate Awareness" },

    // Changemaker Mode (11-14)
    YA006: { A: 10, B: 7, C: 4, D: 0, max: 10, dim: "Sustainable Habits", cat: "Water Conservation" },
    YA007: { A: 10, B: 7, C: 4, D: 0, max: 10, dim: "Sustainable Habits", cat: "Energy Conservation" },
    YA008: { A: 10, B: 7, C: 4, D: 0, max: 10, dim: "Sustainable Habits", cat: "Waste & Recycling" },
    YA009: { A: 10, B: 7, C: 4, D: 0, max: 10, dim: "Sustainable Habits", cat: "Food Sustainability" },
    YA010: { A: 10, B: 7, C: 4, D: 0, max: 10, dim: "Sustainable Habits", cat: "Circular Economy" },
    YA011: { A: 10, B: 7, C: 4, D: 0, max: 10, dim: "Sustainable Habits", cat: "Sustainable Purchasing" },
    YA012: { A: 10, B: 7, C: 4, D: 0, max: 10, dim: "Sustainable Habits", cat: "Nature & Biodiversity" },
    YA013: { A: 10, B: 7, C: 4, D: 0, max: 10, dim: "Sustainable Habits", cat: "Digital Sustainability" },
    YA014: { A: 10, B: 7, C: 4, D: 0, max: 10, dim: "Decision-making", cat: "Waste & Recycling" },
    YA015: { A: 10, B: 10, C: 4, D: 0, max: 10, dim: "Decision-making", cat: "Green Transport" },
    YA016: { A: 10, B: 10, C: 7, D: 0, max: 10, dim: "Decision-making", cat: "Food Sustainability" },
    YA017: { A: 10, B: 10, C: 4, D: 0, max: 10, dim: "Decision-making", cat: "Circular Economy" },
    YA018: { A: 10, B: 10, C: 4, D: 0, max: 10, dim: "Decision-making", cat: "Water Conservation" },
    YA019: { A: 10, B: 10, C: 4, D: 0, max: 10, dim: "Decision-making", cat: "Sustainable Purchasing" },
    YA020: { A: 10, B: 10, C: 7, D: 0, max: 10, dim: "Decision-making", cat: "Nature & Biodiversity" },
    YA021: { A: 10, B: 0, C: 0, D: 0, max: 10, dim: "Environmental Awareness", cat: "Climate Awareness" },
    YA022: { A: 10, B: 0, C: 0, D: 0, max: 10, dim: "Environmental Awareness", cat: "Product Lifecycle" },
    YA023: { A: 10, B: 0, C: 0, D: 0, max: 10, dim: "Environmental Awareness", cat: "Food Sustainability" },
    YA024: { A: 10, B: 0, C: 0, D: 0, max: 10, dim: "Environmental Awareness", cat: "Circular Economy" },
    YA025: { A: 10, B: 0, C: 0, D: 0, max: 10, dim: "Environmental Awareness", cat: "Carbon Literacy" },
    YA026: { A: 10, B: 0, C: 0, D: 0, max: 10, dim: "Environmental Awareness", cat: "Energy Conservation" },
    YA027: { A: 10, B: 10, C: 7, D: 0, max: 10, dim: "Practical Application", cat: "Energy Conservation" },
    YA028: { A: 10, B: 10, C: 4, D: 0, max: 10, dim: "Practical Application", cat: "Food Sustainability" },
    YA029: { A: 10, B: 7, C: 4, D: 0, max: 10, dim: "Practical Application", cat: "Climate Awareness" },
    YA030: { A: 10, B: 7, C: 4, D: 0, max: 10, dim: "Practical Application", cat: "Sustainable Lifestyle" }
  });

  // =========================================================================
  // 3. FIVE ESSENTIAL CARBON FOOTPRINT MISSIONS (Per Age Group)
  // =========================================================================
  const FOOTPRINT_MISSIONS = Object.freeze({
    "8-10": [
      {
        Mission_ID: "KID_FP01",
        Mission_Number: 1,
        Age_Group: "8-10",
        Topic: "My Journey to School",
        Prompt: "How do you usually travel to school?",
        Subtitle: "Pick your main school ride, how far your school is, and how many days you go each week. Ask a parent or guardian if you aren't sure about kilometres!",
        Interaction_Idea: "Mode selection: school bus, car, auto-rickshaw, public bus/train, bicycle, walking, other.",
        Activity_Data_Fields: "transport mode; fuel where applicable; occupancy; one-way distance; return trips; school days/week; mixed-mode leg",
        Units: "km; trips; passengers",
        Calculation_Notes: "Parent/guardian assistance for distance and vehicle details. Student school commuting (not corporate Scope 3 Cat 7)."
      },
      {
        Mission_ID: "KID_FP02",
        Mission_Number: 2,
        Age_Group: "8-10",
        Topic: "My Daily Travel (Outside School)",
        Prompt: "Where else do you travel during a normal week?",
        Subtitle: "Think about trips to sports, hobby classes, parks, or visiting family. Don't count your school journey again!",
        Interaction_Idea: "Map distance bands plus weekly trip counter.",
        Activity_Data_Fields: "journey type; transport mode; approximate distance; frequency; occupancy",
        Units: "km; trips/week; passengers",
        Calculation_Notes: "Excludes journeys already captured in Mission 1 (school commute) to avoid double counting."
      },
      {
        Mission_ID: "KID_FP03",
        Mission_Number: 3,
        Age_Group: "8-10",
        Topic: "Electricity at Home",
        Prompt: "How much electricity does your home use in a typical month?",
        Subtitle: "Invite a parent or guardian to check an electricity bill or meter with you, and tell us how many people share your home!",
        Interaction_Idea: "Parent-assisted electricity meter/bill entry.",
        Activity_Data_Fields: "monthly kWh; household size; reporting period; bill availability; guardian assistance",
        Units: "kWh/month; persons",
        Calculation_Notes: "Do not attribute the entire household bill to the child. Allocated using per-capita household share (1 / household size)."
      },
      {
        Mission_ID: "KID_FP04",
        Mission_Number: 4,
        Age_Group: "8-10",
        Topic: "My School Supplies & Digital Devices",
        Prompt: "What school supplies and digital devices do you use?",
        Subtitle: "Open your virtual school bag! Count the notebooks, stationery and uniforms from the last 12 months, plus any tablet, computer or phone you use.",
        Interaction_Idea: "School bag opens into books, notebooks, stationery, uniforms and devices.",
        Activity_Data_Fields: "notebooks/books; stationery; uniforms; device type; device age/ownership; shared vs personal; daily use hours",
        Units: "items/year; hours/day",
        Calculation_Notes: "Uses ISO 14067-aligned product lifecycle proxies; shared devices are allocated across users."
      },
      {
        Mission_ID: "KID_FP05",
        Mission_Number: 5,
        Age_Group: "8-10",
        Topic: "My Food & Food Waste",
        Prompt: "What food do you usually eat and how much food is left on your plate?",
        Subtitle: "Build your everyday meal plate and tell us what happens to any leftover food at home or school!",
        Interaction_Idea: "Interactive plate and leftovers; adult-assisted portion estimates.",
        Activity_Data_Fields: "food category; meal frequency; portion size; waste frequency & quantity; disposal method",
        Units: "g/meal; meals/week; kg waste",
        Calculation_Notes: "Captures dietary pattern, portion/frequency, and food waste treatment (composting vs landfill)."
      }
    ],
    "11-14": [
      {
        Mission_ID: "YA_FP01",
        Mission_Number: 1,
        Age_Group: "11-14",
        Topic: "My Journey to School",
        Prompt: "What transport modes do you use for your school commute, and how far do you travel?",
        Subtitle: "Configure your primary school commute, one-way distance, weekly school days, vehicle occupancy, and any secondary leg (e.g., walking or auto to a bus/metro stop).",
        Interaction_Idea: "Commute planner with mode, distance and occupancy.",
        Activity_Data_Fields: "mode; fuel; occupancy; one-way km; school days/week; return trips; mixed-mode leg",
        Units: "km; trips; passengers",
        Calculation_Notes: "Include mixed-mode trips as separate legs. Categorised as Student School Commuting."
      },
      {
        Mission_ID: "YA_FP02",
        Mission_Number: 2,
        Age_Group: "11-14",
        Topic: "My Daily Travel (Beyond School)",
        Prompt: "What additional non-school journeys do you make in a typical week?",
        Subtitle: "Include coaching, sports, errands or recreational trips. Do not include your school commute from Mission 1.",
        Interaction_Idea: "Weekly calendar and non-school travel simulator.",
        Activity_Data_Fields: "journey type; mode; fuel; round-trip km; trips/week; shared vs individual occupancy",
        Units: "km; trips/week; passengers",
        Calculation_Notes: "Strict boundary separation from Mission 1 to prevent double counting."
      },
      {
        Mission_ID: "YA_FP03",
        Mission_Number: 3,
        Age_Group: "11-14",
        Topic: "Electricity at Home",
        Prompt: "How much electricity does your household consume, and how many people share it?",
        Subtitle: "Enter your monthly household electricity consumption (kWh) from a bill or estimate, your household size, and the reporting period.",
        Interaction_Idea: "Parent-assisted monthly kWh and household allocation dashboard.",
        Activity_Data_Fields: "monthly kWh; household size; reporting period; bill availability; guardian assistance",
        Units: "kWh/month; persons",
        Calculation_Notes: "Uses CEA India grid emission factor and transparent equal per-capita household allocation (1 / household size)."
      },
      {
        Mission_ID: "YA_FP04",
        Mission_Number: 4,
        Age_Group: "11-14",
        Topic: "My School Supplies & Digital Devices",
        Prompt: "What school supplies, uniforms and electronic devices have you purchased or used in the last 12 months?",
        Subtitle: "Log your annual notebooks, textbooks, stationery and uniforms, along with your primary study/entertainment devices, their age, ownership and daily screen hours.",
        Interaction_Idea: "Lifecycle explorer for products and devices.",
        Activity_Data_Fields: "notebooks/books; stationery; uniforms; device types; device age; shared vs personal; daily usage hours",
        Units: "items/year; hours/day",
        Calculation_Notes: "Applies ISO 14067-aligned product lifecycle proxies and amortises embodied device emissions by age and sharing ratio."
      },
      {
        Mission_ID: "YA_FP05",
        Mission_Number: 5,
        Age_Group: "11-14",
        Topic: "My Food & Food Waste",
        Prompt: "What food do you consume, how frequently, and how much food is wasted?",
        Subtitle: "Track your typical dietary pattern, dairy/protein frequency, portion size, weekly food waste estimate, and how food waste is managed.",
        Interaction_Idea: "Food footprint diary and waste tracking.",
        Activity_Data_Fields: "food categories; portions; meal frequency; waste frequency & quantity; disposal method",
        Units: "g/portion; meals/week; kg waste",
        Calculation_Notes: "Uses India-relevant food emission factors and waste treatment factors (composting vs landfill)."
      }
    ]
  });

  // =========================================================================
  // 4. CENTRAL EMISSION_FACTORS REPOSITORY (16-Column Schema)
  //    Synchronised with Apps Script (Code.gs) & My_Carbon_Credit_Research_Template.xlsx
  // =========================================================================
  const DEFAULT_EMISSION_FACTORS = [
    {
      Emission_Factor_ID: "EF_ELEC_CEA_IN",
      Category: "Electricity",
      Subcategory: "Grid Electricity (India Weighted Average)",
      Factor_Value: 0.727,
      Factor_Unit: "kg CO2e/kWh",
      Geography: "India",
      Source_Name: "Central Electricity Authority (CEA) CO2 Baseline Database",
      Source_URL: "https://cea.nic.in/cdm-co2-baseline-database/",
      Publication_Year: 2024,
      Applicable_Year: 2024,
      GWP_Version: "IPCC AR5/AR6 GWP100",
      Lifecycle_Boundary: "Generation to grid (Scope 2 location-based)",
      Data_Quality: "High (Official National Inventory)",
      Notes: "CEA CO2 Baseline Database v20.0 weighted average grid emission factor for India.",
      Version: "20.0",
      Active_Status: "Active"
    },
    {
      Emission_Factor_ID: "EF_TR_WALK_CYCLE",
      Category: "Transport",
      Subcategory: "Walking or Cycling",
      Factor_Value: 0.0,
      Factor_Unit: "kg CO2e/km",
      Geography: "Global / India",
      Source_Name: "GHG Protocol / India GHG Program",
      Source_URL: "https://indiaghgp.org/",
      Publication_Year: 2024,
      Applicable_Year: 2024,
      GWP_Version: "IPCC AR6 GWP100",
      Lifecycle_Boundary: "Direct tailpipe (Tank-to-Wheel)",
      Data_Quality: "High",
      Notes: "Zero direct tailpipe operational emissions.",
      Version: "1.0",
      Active_Status: "Active"
    },
    {
      Emission_Factor_ID: "EF_TR_SCHOOL_BUS",
      Category: "Transport",
      Subcategory: "School Bus / Public Bus",
      Factor_Value: 0.027,
      Factor_Unit: "kg CO2e/passenger-km",
      Geography: "India",
      Source_Name: "India GHG Program – Road Transport Emission Factors / UK DESNZ Proxy",
      Source_URL: "https://indiaghgp.org/",
      Publication_Year: 2024,
      Applicable_Year: 2024,
      GWP_Version: "IPCC AR6 GWP100",
      Lifecycle_Boundary: "Direct operational per passenger-km",
      Data_Quality: "Medium-High",
      Notes: "Shared school/public bus per passenger-km assuming standard student occupancy.",
      Version: "1.0",
      Active_Status: "Active"
    },
    {
      Emission_Factor_ID: "EF_TR_METRO_TRAIN",
      Category: "Transport",
      Subcategory: "Metro / Suburban Rail",
      Factor_Value: 0.032,
      Factor_Unit: "kg CO2e/passenger-km",
      Geography: "India",
      Source_Name: "India GHG Program Rail Fact Sheet",
      Source_URL: "https://indiaghgp.org/",
      Publication_Year: 2024,
      Applicable_Year: 2024,
      GWP_Version: "IPCC AR6 GWP100",
      Lifecycle_Boundary: "Traction electricity per passenger-km",
      Data_Quality: "Medium-High",
      Notes: "Urban metro/suburban rail traction factor.",
      Version: "1.0",
      Active_Status: "Active"
    },
    {
      Emission_Factor_ID: "EF_TR_AUTO",
      Category: "Transport",
      Subcategory: "Three-Wheeler Auto-Rickshaw (CNG/Petrol)",
      Factor_Value: 0.105,
      Factor_Unit: "kg CO2e/vehicle-km",
      Geography: "India",
      Source_Name: "India GHG Program / ARAI",
      Source_URL: "https://indiaghgp.org/",
      Publication_Year: 2024,
      Applicable_Year: 2024,
      GWP_Version: "IPCC AR6 GWP100",
      Lifecycle_Boundary: "Vehicle-km (divided by passenger occupancy)",
      Data_Quality: "High (India specific)",
      Notes: "Divided by number of passengers sharing the auto-rickshaw.",
      Version: "1.0",
      Active_Status: "Active"
    },
    {
      Emission_Factor_ID: "EF_TR_TWO_WHEELER",
      Category: "Transport",
      Subcategory: "Two-Wheeler (Scooter/Motorcycle)",
      Factor_Value: 0.068,
      Factor_Unit: "kg CO2e/vehicle-km",
      Geography: "India",
      Source_Name: "India GHG Program / ARAI",
      Source_URL: "https://indiaghgp.org/",
      Publication_Year: 2024,
      Applicable_Year: 2024,
      GWP_Version: "IPCC AR6 GWP100",
      Lifecycle_Boundary: "Vehicle-km (adjusted by fuel modifier & occupancy)",
      Data_Quality: "High (India specific)",
      Notes: "Baseline petrol two-wheeler; EV two-wheeler scaled by 0.28 grid factor ratio.",
      Version: "1.0",
      Active_Status: "Active"
    },
    {
      Emission_Factor_ID: "EF_TR_CAR_PETROL",
      Category: "Transport",
      Subcategory: "Passenger Car (Petrol Baseline)",
      Factor_Value: 0.168,
      Factor_Unit: "kg CO2e/vehicle-km",
      Geography: "India",
      Source_Name: "India GHG Program / BEE Passenger Car Fleet",
      Source_URL: "https://indiaghgp.org/",
      Publication_Year: 2024,
      Applicable_Year: 2024,
      GWP_Version: "IPCC AR6 GWP100",
      Lifecycle_Boundary: "Vehicle-km (divided by passenger occupancy)",
      Data_Quality: "High (India specific)",
      Notes: "Fuel modifiers applied: Petrol=1.0, Diesel=1.14, CNG=0.76, Hybrid=0.68, EV=0.32.",
      Version: "1.0",
      Active_Status: "Active"
    },
    {
      Emission_Factor_ID: "EF_SUP_NOTEBOOK",
      Category: "School Supplies",
      Subcategory: "Notebook / Textbook (Paper Product)",
      Factor_Value: 0.85,
      Factor_Unit: "kg CO2e/item",
      Geography: "Global / India Proxy",
      Source_Name: "ISO 14067 Literature / US EPA EEIO / DEFRA Paper Proxy",
      Source_URL: "https://www.gov.uk/government/collections/government-conversion-factors-for-company-reporting",
      Publication_Year: 2024,
      Applicable_Year: 2024,
      GWP_Version: "IPCC AR6 GWP100",
      Lifecycle_Boundary: "Cradle-to-gate (pulp, paper manufacturing & distribution)",
      Data_Quality: "Medium (Product Proxy)",
      Notes: "Assumes ~250g average student notebook/book at ~3.4 kg CO2e/kg paper.",
      Version: "1.0",
      Active_Status: "Active"
    },
    {
      Emission_Factor_ID: "EF_SUP_STATIONERY",
      Category: "School Supplies",
      Subcategory: "Stationery Set (Pens, Pencils, Pouch, Art Supplies)",
      Factor_Value: 1.6,
      Factor_Unit: "kg CO2e/set",
      Geography: "Global Proxy",
      Source_Name: "EXIOBASE / DEFRA Material Proxies",
      Source_URL: "https://www.exiobase.eu/",
      Publication_Year: 2024,
      Applicable_Year: 2024,
      GWP_Version: "IPCC AR6 GWP100",
      Lifecycle_Boundary: "Cradle-to-gate",
      Data_Quality: "Medium (Spend/Material Proxy)",
      Notes: "Annual stationery pack proxy.",
      Version: "1.0",
      Active_Status: "Active"
    },
    {
      Emission_Factor_ID: "EF_SUP_UNIFORM",
      Category: "School Supplies",
      Subcategory: "School Uniform Set (Shirt, Trousers/Skirt, Shoes)",
      Factor_Value: 9.5,
      Factor_Unit: "kg CO2e/set",
      Geography: "India / Global Apparel Proxy",
      Source_Name: "ISO 14067 Apparel Studies / Quantis / DEFRA Textile Proxy",
      Source_URL: "https://www.gov.uk/government/collections/government-conversion-factors-for-company-reporting",
      Publication_Year: 2024,
      Applicable_Year: 2024,
      GWP_Version: "IPCC AR6 GWP100",
      Lifecycle_Boundary: "Cradle-to-gate textile & footwear production",
      Data_Quality: "Medium (Apparel Proxy)",
      Notes: "Amortised over 12 months.",
      Version: "1.0",
      Active_Status: "Active"
    },
    {
      Emission_Factor_ID: "EF_DEV_EMBODIED",
      Category: "Digital Devices",
      Subcategory: "Personal Learning Device Embodied Carbon (Tablet/Laptop/Phone)",
      Factor_Value: 48.0,
      Factor_Unit: "kg CO2e/device-year",
      Geography: "Global Manufacturing",
      Source_Name: "Manufacturer Product Carbon Footprints (ISO 14067 aligned)",
      Source_URL: "https://www.iso.org/standard/71206.html",
      Publication_Year: 2024,
      Applicable_Year: 2024,
      GWP_Version: "IPCC AR6 GWP100",
      Lifecycle_Boundary: "Cradle-to-gate manufacturing amortised per year of useful life",
      Data_Quality: "Medium-High (Product PCF average)",
      Notes: "Divided by sharing users (1 for personal, household/2 for shared) and scaled by device type (Tablet=0.65, Smartphone=0.45, Laptop=1.0, Desktop=1.25).",
      Version: "1.0",
      Active_Status: "Active"
    },
    {
      Emission_Factor_ID: "EF_FOOD_DIET_BASE",
      Category: "Food",
      Subcategory: "Child Dietary Baseline (India Meal Pattern)",
      Factor_Value: 1.05,
      Factor_Unit: "kg CO2e/day ( Vegetarian baseline)",
      Geography: "India",
      Source_Name: "CGIAR / FAO India Dietary Footprint Studies",
      Source_URL: "https://www.fao.org/",
      Publication_Year: 2023,
      Applicable_Year: 2024,
      GWP_Version: "IPCC AR6 GWP100",
      Lifecycle_Boundary: "Farm-to-fork",
      Data_Quality: "Medium-High (Regional dietary estimate)",
      Notes: "Adjusted by diet pattern (Plant-rich=0.82, Vegetarian=1.0, Eggetarian=1.12, Mixed/Non-Veg=1.45), dairy servings and portion factor.",
      Version: "1.0",
      Active_Status: "Active"
    },
    {
      Emission_Factor_ID: "EF_FOOD_WASTE_LANDFILL",
      Category: "Food Waste",
      Subcategory: "Unsorted Food Waste Sent to Landfill",
      Factor_Value: 1.9,
      Factor_Unit: "kg CO2e/kg food wasted",
      Geography: "India / Global Proxy",
      Source_Name: "IPCC Waste Guidelines / UK DESNZ Food Waste Factor",
      Source_URL: "https://www.ipcc-nggip.iges.or.jp/",
      Publication_Year: 2024,
      Applicable_Year: 2024,
      GWP_Version: "IPCC AR6 GWP100",
      Lifecycle_Boundary: "End-of-life disposal (methane generation)",
      Data_Quality: "Medium (Waste Treatment Proxy)",
      Notes: "Composting reduces end-of-life disposal factor by ~85% (to 0.25 kg CO2e/kg).",
      Version: "1.0",
      Active_Status: "Active"
    }
  ];

  let activeEmissionFactors = [...DEFAULT_EMISSION_FACTORS];

  function setEmissionFactors(factorsList) {
    if (Array.isArray(factorsList) && factorsList.length > 0) {
      activeEmissionFactors = factorsList;
    }
  }

  function getEmissionFactors() {
    return activeEmissionFactors.map((ef) => ({ ...ef }));
  }

  function getFactorById(id, fallbackValue) {
    const found = activeEmissionFactors.find((f) => f.Emission_Factor_ID === id && String(f.Active_Status).toLowerCase() !== "inactive");
    return found ? Number(found.Factor_Value) : fallbackValue;
  }

  // =========================================================================
  // 5. BALANCED QUESTION SELECTION ENGINE (3 + 3 + 2 + 2 = 10)
  // =========================================================================
  const REQUIRED_DISTRIBUTION = Object.freeze({
    "Sustainable Habits": 3,
    "Decision-making": 3,
    "Environmental Awareness": 2,
    "Practical Application": 2
  });

  function sanitizeQuestionForFrontend(rawQ) {
    return {
      Question_ID: rawQ.Question_ID,
      Age_Group: rawQ.Age_Group,
      Category: rawQ.Category,
      Sub_Category: rawQ.Sub_Category,
      Difficulty: rawQ.Difficulty,
      Question_Type: rawQ.Question_Type,
      Question_Text: rawQ.Question_Text,
      Option_A: rawQ.Option_A,
      Option_B: rawQ.Option_B,
      Option_C: rawQ.Option_C,
      Option_D: rawQ.Option_D,
      Explanation: rawQ.Explanation,
      Assessment_Dimension: rawQ.Assessment_Dimension,
      Topic_ID: rawQ.Topic_ID,
      Competency_ID: rawQ.Competency_ID,
      Maximum_Points: Number(rawQ.Maximum_Points) || 10,
      Interaction_Idea: rawQ.Interaction_Idea,
      sceneType: rawQ.sceneType || "nature_garden"
    };
  }

  function getQuestionBank(ageGroup) {
    const source = ageGroup === "11-14" ? RAW_KIDS_QUESTIONS_11_14 : RAW_KIDS_QUESTIONS_8_10;
    return source.map(sanitizeQuestionForFrontend);
  }

  function shuffleArray(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = copy[i];
      copy[i] = copy[j];
      copy[j] = tmp;
    }
    return copy;
  }

  /**
   * Selects 10 questions maintaining the exact 3 / 3 / 2 / 2 distribution
   * across the 4 Assessment_Dimension categories, then shuffles the final 10.
   */
  function selectBalancedQuestions(ageGroup) {
    const bank = getQuestionBank(ageGroup);
    const selected = [];

    Object.entries(REQUIRED_DISTRIBUTION).forEach(([dimension, count]) => {
      const pool = bank.filter((q) => q.Assessment_Dimension === dimension);
      const shuffledPool = shuffleArray(pool);
      selected.push(...shuffledPool.slice(0, count));
    });

    const shuffledFinal = shuffleArray(selected);
    return {
      selectedQuestionIds: selected.map((q) => q.Question_ID),
      questionOrder: shuffledFinal.map((q) => q.Question_ID),
      questions: shuffledFinal
    };
  }

  function reconstructQuestionsFromOrder(ageGroup, questionOrderIds) {
    const bank = getQuestionBank(ageGroup);
    const byId = new Map(bank.map((q) => [q.Question_ID, q]));
    const ordered = (questionOrderIds || []).map((id) => byId.get(id)).filter(Boolean);
    if (ordered.length >= 10) return ordered.slice(0, 10);
    return selectBalancedQuestions(ageGroup).questions;
  }

  // =========================================================================
  // 6. AUTHORITATIVE GREEN SCORE EVALUATION (Only invoked post-answer / submit)
  // =========================================================================
  function evaluateSingleAnswer(questionId, selectedOptionKey) {
    const entry = SEALED_OPTION_SCORES[questionId];
    if (!entry || !selectedOptionKey) {
      return { awardedPoints: 0, maxPoints: 10, tier: "neutral" };
    }
    const key = String(selectedOptionKey).toUpperCase().trim();
    const pts = typeof entry[key] === "number" ? entry[key] : 0;
    const tier = pts === 10 ? "optimal" : pts >= 7 ? "good" : pts >= 4 ? "growing" : "learning";
    return {
      awardedPoints: pts,
      maxPoints: entry.max || 10,
      dimension: entry.dim,
      category: entry.cat,
      tier
    };
  }

  function calculateFullGreenScore(questionOrderIds, answersByQuestionId) {
    const dimensions = {
      "Sustainable Habits": { earned: 0, max: 30, count: 0 },
      "Decision-making": { earned: 0, max: 30, count: 0 },
      "Environmental Awareness": { earned: 0, max: 20, count: 0 },
      "Practical Application": { earned: 0, max: 20, count: 0 }
    };

    const categories = {};
    const questionRecords = [];
    let totalGreenScore = 0;
    let optimalCount = 0;

    (questionOrderIds || []).forEach((qId) => {
      const selectedOpt = answersByQuestionId[qId] || "";
      const evalResult = evaluateSingleAnswer(qId, selectedOpt);
      const pts = evalResult.awardedPoints;
      const maxPts = evalResult.maxPoints;
      const dim = evalResult.dimension || "Sustainable Habits";
      const cat = evalResult.category || "General";

      totalGreenScore += pts;
      if (pts === 10) optimalCount += 1;

      if (dimensions[dim]) {
        dimensions[dim].earned += pts;
        dimensions[dim].count += 1;
      }

      if (!categories[cat]) {
        categories[cat] = { earned: 0, max: 0, count: 0 };
      }
      categories[cat].earned += pts;
      categories[cat].max += maxPts;
      categories[cat].count += 1;

      questionRecords.push({
        Question_ID: qId,
        Category: dim,
        Topic_Category: cat,
        Selected_Option: selectedOpt,
        Awarded_Points: pts,
        Maximum_Points: maxPts
      });
    });

    totalGreenScore = Math.min(100, totalGreenScore);

    // Determine strongest & improvement category
    let strongestCategory = "Water Conservation";
    let improvementArea = "Energy Conservation";
    let bestPct = -1;
    let lowestPct = 101;

    Object.entries(categories).forEach(([catName, stats]) => {
      const pct = stats.max > 0 ? Math.round((stats.earned / stats.max) * 100) : 0;
      stats.percentage = pct;
      if (pct > bestPct) {
        bestPct = pct;
        strongestCategory = catName;
      }
      if (pct < lowestPct) {
        lowestPct = pct;
        improvementArea = catName;
      }
    });

    const pctOverall = Math.round((totalGreenScore / 100) * 100);
    let learningStage = "Sprout Explorer";
    if (pctOverall >= 85) learningStage = "Planet Protector Champion";
    else if (pctOverall >= 70) learningStage = "Green Trailblazer";
    else if (pctOverall >= 50) learningStage = "Growing Eco Ranger";

    return {
      Overall_Green_Score: totalGreenScore,
      Maximum_Green_Score: 100,
      Quiz_Score_Percentage: pctOverall,
      Optimal_Answers_Count: optimalCount,
      Sustainable_Habit_Score: dimensions["Sustainable Habits"].earned,
      Decision_Making_Score: dimensions["Decision-making"].earned,
      Environmental_Awareness_Score: dimensions["Environmental Awareness"].earned,
      Practical_Application_Score: dimensions["Practical Application"].earned,
      Learning_Stage: learningStage,
      Strongest_Category: strongestCategory,
      Improvement_Area: improvementArea,
      dimensions,
      categories,
      questionRecords
    };
  }

  // =========================================================================
  // 7. SEPARATE CARBON FOOTPRINT CALCULATION ENGINE (kg CO2e / month & year)
  // =========================================================================
  function calculateKidsCarbonFootprint(missionsData) {
    const m1 = missionsData?.FP01 || {};
    const m2 = missionsData?.FP02 || {};
    const m3 = missionsData?.FP03 || {};
    const m4 = missionsData?.FP04 || {};
    const m5 = missionsData?.FP05 || {};

    const breakdownRows = [];
    const weeksPerMonth = 4.33;

    const fuelMultipliers = {
      petrol: 1.0,
      diesel: 1.14,
      cng: 0.76,
      hybrid: 0.68,
      ev: 0.32,
      na: 1.0
    };

    function computeModeKmFactor(mode, fuel, occupancy) {
      const occ = Math.max(1, Number(occupancy) || 1);
      const fMult = fuelMultipliers[fuel] || 1.0;
      switch (mode) {
        case "walk":
        case "cycle":
          return { factor: getFactorById("EF_TR_WALK_CYCLE", 0), efId: "EF_TR_WALK_CYCLE" };
        case "school_bus":
        case "public_bus":
          return { factor: getFactorById("EF_TR_SCHOOL_BUS", 0.027), efId: "EF_TR_SCHOOL_BUS" };
        case "metro_train":
          return { factor: getFactorById("EF_TR_METRO_TRAIN", 0.032), efId: "EF_TR_METRO_TRAIN" };
        case "auto":
          return { factor: (getFactorById("EF_TR_AUTO", 0.105) * fMult) / occ, efId: "EF_TR_AUTO" };
        case "two_wheeler":
          return { factor: (getFactorById("EF_TR_TWO_WHEELER", 0.068) * fMult) / occ, efId: "EF_TR_TWO_WHEELER" };
        case "car":
        default:
          return { factor: (getFactorById("EF_TR_CAR_PETROL", 0.168) * fMult) / occ, efId: "EF_TR_CAR_PETROL" };
      }
    }

    // --- 1. School Commuting (Mission 1) ---
    const m1Mode = m1.mode || "school_bus";
    const m1Fuel = m1.fuel || (m1Mode === "walk" || m1Mode === "cycle" ? "na" : "petrol");
    const m1Dist = Math.max(0, Number(m1.oneWayKm) || 0);
    const m1Days = Math.min(7, Math.max(0, Number(m1.schoolDaysPerWeek) || 5));
    const m1ReturnMult = m1.returnTrip === "one_way" ? 1 : 2;
    const m1Occ = Math.max(1, Number(m1.occupancy) || (m1Mode === "car" ? 2 : 1));
    const m1MonthlyKm = m1Dist * m1ReturnMult * m1Days * weeksPerMonth;
    const m1Ef = computeModeKmFactor(m1Mode, m1Fuel, m1Occ);
    let schoolCommuteKg = m1MonthlyKm * m1Ef.factor;

    let leg2Note = "";
    if (m1.hasSecondLeg && Number(m1.leg2Km) > 0) {
      const leg2Mode = m1.leg2Mode || "walk";
      const leg2Dist = Math.max(0, Number(m1.leg2Km) || 0);
      const leg2Occ = Math.max(1, Number(m1.leg2Occupancy) || 2);
      const leg2Ef = computeModeKmFactor(leg2Mode, "petrol", leg2Occ);
      const leg2MonthlyKm = leg2Dist * m1ReturnMult * m1Days * weeksPerMonth;
      schoolCommuteKg += leg2MonthlyKm * leg2Ef.factor;
      leg2Note = ` Includes secondary leg (${leg2Mode}, ${leg2Dist} km one-way).`;
    }
    schoolCommuteKg = Number(schoolCommuteKg.toFixed(2));

    breakdownRows.push({
      Emission_Category: "School Commuting",
      Activity_Data: Number(m1MonthlyKm.toFixed(1)),
      Activity_Unit: "km/month",
      Emission_Factor_ID: m1Ef.efId,
      Emission_Factor_Value: Number(m1Ef.factor.toFixed(4)),
      Calculated_Emissions: schoolCommuteKg,
      Calculation_Status: "Calculated Estimate",
      Assumptions: `Student school commute (${m1Mode}, ${m1Dist} km one-way, ${m1Days} days/week, ${m1ReturnMult === 2 ? "return" : "one-way"}, occupancy ${m1Occ}).${leg2Note} Categorised as student school travel (distinct from corporate Scope 3 Category 7).`
    });

    // --- 2. Daily Travel Beyond School (Mission 2) ---
    const m2TypesList =
      Array.isArray(m2.journeyTypes) && m2.journeyTypes.length > 0
        ? m2.journeyTypes
        : m2.journeyType
        ? String(m2.journeyType)
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : ["sports_tuition"];
    const m2Type = m2TypesList.includes("none") ? "none" : m2TypesList.join(", ");
    let dailyTravelKg = 0;
    let m2MonthlyKm = 0;
    let m2Ef = { factor: 0, efId: "EF_TR_WALK_CYCLE" };

    if (m2Type !== "none") {
      const m2ModesList =
        Array.isArray(m2.modes) && m2.modes.length > 0
          ? m2.modes
          : m2.mode
          ? String(m2.mode)
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : ["cycle"];
      const m2Fuel = m2.fuel || "petrol";
      const m2Dist = Math.max(0, Number(m2.distanceKm) || 0);
      const m2Trips = Math.max(0, Number(m2.tripsPerWeek) || 0);
      const m2Occ = Math.max(1, Number(m2.occupancy) || 2);
      // m2Dist is round-trip distance per outing
      m2MonthlyKm = m2Dist * m2Trips * weeksPerMonth;
      const efList = m2ModesList.map((md) => computeModeKmFactor(md, m2Fuel, m2Occ));
      const avgFactor = efList.reduce((acc, item) => acc + item.factor, 0) / efList.length;
      m2Ef = { factor: avgFactor, efId: efList[0]?.efId || "EF_TR_WALK_CYCLE" };
      dailyTravelKg = Number((m2MonthlyKm * m2Ef.factor).toFixed(2));
    }

    breakdownRows.push({
      Emission_Category: "Additional Daily Travel",
      Activity_Data: Number(m2MonthlyKm.toFixed(1)),
      Activity_Unit: "km/month",
      Emission_Factor_ID: m2Ef.efId,
      Emission_Factor_Value: Number(m2Ef.factor.toFixed(4)),
      Calculated_Emissions: dailyTravelKg,
      Calculation_Status: "Calculated Estimate",
      Assumptions: m2Type === "none"
        ? "No additional non-school travel reported."
        : `Non-school travel (${m2Type}, mode: ${m2.mode || "cycle"}, ${m2.distanceKm || 0} km/trip, ${m2.tripsPerWeek || 0} trips/week). Excludes school commute to avoid double counting.`
    });

    // --- 3. Allocated Household Electricity (Mission 3) ---
    const billStatus = m3.billAvailable || "estimate"; // "yes" | "estimate" | "unavailable"
    const householdSize = Math.max(1, Number(m3.householdSize) || 4);
    const gridFactor = getFactorById("EF_ELEC_CEA_IN", 0.727);
    const reportingPeriod = m3.reportingPeriod || "Typical Month";
    const guardianHelped = m3.guardianAssisted ? "Yes (Guardian assisted)" : "Self-reported";

    let allocatedElecKg = 0;
    let allocatedKwh = 0;
    let elecStatus = "Calculated Estimate";
    let elecAssumptions = "";

    if (billStatus === "unavailable" || m3.monthlyKwh === "" || m3.monthlyKwh === null || m3.monthlyKwh === undefined) {
      elecStatus = "Incomplete – Bill Data Unavailable";
      allocatedElecKg = 0;
      allocatedKwh = 0;
      elecAssumptions = `Household electricity bill/meter data was marked unavailable (${reportingPeriod}). In accordance with carbon accounting transparency rules, no invented value is added to the calculated total.`;
    } else {
      const totalHouseholdKwh = Math.max(0, Number(m3.monthlyKwh) || 0);
      allocatedKwh = Number((totalHouseholdKwh / householdSize).toFixed(1));
      allocatedElecKg = Number((allocatedKwh * gridFactor).toFixed(2));
      elecStatus = billStatus === "yes" ? "Calculated Estimate (Bill/Meter)" : "Indicative Estimate (Household Band)";
      elecAssumptions = `Household electricity (${totalHouseholdKwh} kWh/month for ${reportingPeriod}, ${guardianHelped}) allocated using equal per-capita share (1/${householdSize} = ${(100 / householdSize).toFixed(1)}%) × CEA India Grid Factor (${gridFactor} kg CO2e/kWh, 2024). Whole-household consumption is never attributed to a single child.`;
    }

    breakdownRows.push({
      Emission_Category: "Allocated Household Electricity",
      Activity_Data: allocatedKwh,
      Activity_Unit: "kWh/month (allocated)",
      Emission_Factor_ID: "EF_ELEC_CEA_IN",
      Emission_Factor_Value: gridFactor,
      Calculated_Emissions: allocatedElecKg,
      Calculation_Status: elecStatus,
      Assumptions: elecAssumptions
    });

    // --- 4. School Supplies & Digital Devices (Mission 4) ---
    const notebooksYr = Math.max(0, Number(m4.notebooksPerYear) || 8);
    const stationerySetsYr = Math.max(0, Number(m4.stationerySetsPerYear) || 2);
    const uniformsYr = Math.max(0, Number(m4.uniformSetsPerYear) || 2);
    const notebookFactor = getFactorById("EF_SUP_NOTEBOOK", 0.85);
    const stationeryFactor = getFactorById("EF_SUP_STATIONERY", 1.6);
    const uniformFactor = getFactorById("EF_SUP_UNIFORM", 9.5);

    const annualSuppliesKg =
      notebooksYr * notebookFactor +
      stationerySetsYr * stationeryFactor +
      uniformsYr * uniformFactor;
    const monthlySuppliesKg = annualSuppliesKg / 12;

    // Digital device embodied carbon (allocated by ownership & lifespan)
    // Operational electricity is only added if household electricity was NOT already reported in Mission 3 (avoids double counting!)
    const primaryDevice = m4.primaryDevice || "tablet";
    const deviceOwnership = m4.deviceOwnership || "shared"; // "shared" | "personal"
    const deviceAge = m4.deviceAge || "1_3_yrs";
    const dailyHours = Math.max(0, Number(m4.dailyHours) || 1.5);

    const deviceTypeScaler = {
      none: 0,
      smartphone: 0.45,
      tablet: 0.65,
      laptop: 1.0,
      desktop: 1.25
    };
    const ageRetentionScaler = {
      under_1_yr: 1.15,
      "1_3_yrs": 1.0,
      "3_5_yrs": 0.75,
      over_5_yrs: 0.55
    };
    const shareUsers = deviceOwnership === "personal" ? 1 : Math.max(2, Math.round(householdSize / 2));
    const baseEmbodiedYr = getFactorById("EF_DEV_EMBODIED", 48.0);
    const monthlyDeviceEmbodiedKg =
      ((baseEmbodiedYr * (deviceTypeScaler[primaryDevice] ?? 0.65) * (ageRetentionScaler[deviceAge] ?? 1.0)) /
        shareUsers) /
      12;

    // If Mission 3 electricity is unavailable, estimate standalone device electricity; otherwise 0 to prevent double-counting with home meter!
    const deviceWattageKw = primaryDevice === "desktop" ? 0.12 : primaryDevice === "laptop" ? 0.045 : primaryDevice === "tablet" ? 0.012 : primaryDevice === "smartphone" ? 0.006 : 0;
    const standaloneDeviceElecKg =
      elecStatus.startsWith("Incomplete")
        ? dailyHours * 30 * deviceWattageKw * gridFactor
        : 0;

    const suppliesAndDevicesKg = Number((monthlySuppliesKg + monthlyDeviceEmbodiedKg + standaloneDeviceElecKg).toFixed(2));

    breakdownRows.push({
      Emission_Category: "School Supplies & Digital Devices",
      Activity_Data: Number((notebooksYr + stationerySetsYr + uniformsYr).toFixed(0)),
      Activity_Unit: "items/year + device share",
      Emission_Factor_ID: "EF_SUP_NOTEBOOK",
      Emission_Factor_Value: notebookFactor,
      Calculated_Emissions: suppliesAndDevicesKg,
      Calculation_Status: "Indicative Lifecycle Estimate (Proxy)",
      Assumptions: `Amortised monthly product footprint (${notebooksYr} notebooks/books, ${stationerySetsYr} stationery sets, ${uniformsYr} uniform sets over 12 months) + embodied carbon for ${primaryDevice} (${deviceOwnership}, shared by ${shareUsers}, age: ${deviceAge.replace(/_/g, " ")}). ${
        standaloneDeviceElecKg > 0
          ? "Includes estimated active device electricity since household bill was unavailable."
          : "Active charging electricity is captured under Household Electricity to prevent double counting."
      }`
    });

    // --- 5. Food & Food Waste (Mission 5) ---
    const dietPattern = m5.dietCategory || "vegetarian"; // "plant_rich" | "vegetarian" | "eggetarian" | "mixed_nonveg"
    const dairyServings = Math.max(0, Number(m5.dairyServingsPerDay) ?? 2);
    const portionSize = m5.portionSize || "medium"; // "small" | "medium" | "large"
    const wasteFreq = m5.wasteFrequency || "rarely"; // "never" | "rarely" | "sometimes" | "often"
    const wasteGramsWeek = Math.max(0, Number(m5.wasteGramsPerWeek) ?? (wasteFreq === "never" ? 0 : wasteFreq === "rarely" ? 150 : wasteFreq === "sometimes" ? 400 : 800));
    const wasteDisposal = m5.wasteDisposal || "compost"; // "compost" | "animal_feed" | "segregated" | "landfill"

    const dietMultipliers = {
      plant_rich: 0.82,
      vegetarian: 1.0,
      eggetarian: 1.12,
      mixed_nonveg: 1.45
    };
    const portionMultipliers = {
      small: 0.82,
      medium: 1.0,
      large: 1.2
    };

    const baseDailyFoodKg = getFactorById("EF_FOOD_DIET_BASE", 1.05);
    const monthlyDietKg =
      baseDailyFoodKg *
      30 *
      (dietMultipliers[dietPattern] || 1.0) *
      (portionMultipliers[portionSize] || 1.0) +
      dairyServings * 0.08 * 30;

    const monthlyWasteKgWeight = (wasteGramsWeek / 1000) * weeksPerMonth;
    const baseLandfillWasteEf = getFactorById("EF_FOOD_WASTE_LANDFILL", 1.9);
    const disposalModifier =
      wasteDisposal === "compost" ? 0.15 :
      wasteDisposal === "animal_feed" ? 0.1 :
      wasteDisposal === "segregated" ? 0.45 : 1.0;

    const monthlyFoodWasteEmissions = monthlyWasteKgWeight * baseLandfillWasteEf * disposalModifier;
    const totalFoodKg = Number((monthlyDietKg + monthlyFoodWasteEmissions).toFixed(2));

    const portionLabelMap = {
      small: "small (100 ml)",
      medium: "regular (200 ml)",
      large: "large (300 ml)"
    };
    const portionLabel = portionLabelMap[portionSize] || portionSize;

    breakdownRows.push({
      Emission_Category: "Food & Food Waste",
      Activity_Data: Number(monthlyWasteKgWeight.toFixed(2)),
      Activity_Unit: "kg food waste/month + diet",
      Emission_Factor_ID: "EF_FOOD_DIET_BASE",
      Emission_Factor_Value: baseDailyFoodKg,
      Calculated_Emissions: totalFoodKg,
      Calculation_Status: "Indicative Estimate (Regional Proxy)",
      Assumptions: `Dietary baseline (${dietPattern.replace(/_/g, " ")}, ${portionLabel} dairy portion, ${dairyServings} dairy servings/day) = ${monthlyDietKg.toFixed(1)} kg CO2e/month + food waste (${wasteGramsWeek}g/week, disposal: ${wasteDisposal.replace(/_/g, " ")}) = ${monthlyFoodWasteEmissions.toFixed(2)} kg CO2e/month.`
    });

    const totalMonthlyKg = Number(
      breakdownRows.reduce((sum, row) => sum + (Number(row.Calculated_Emissions) || 0), 0).toFixed(2)
    );
    const totalAnnualKg = Number((totalMonthlyKg * 12).toFixed(1));
    const totalAnnualTonnes = Number((totalAnnualKg / 1000).toFixed(2));
    const hasIncomplete = breakdownRows.some((r) => r.Calculation_Status.startsWith("Incomplete"));

    return {
      Total_Monthly_CO2e_kg: totalMonthlyKg,
      Total_Annual_CO2e_kg: totalAnnualKg,
      Total_Annual_CO2e_t: totalAnnualTonnes,
      Calculation_Status: hasIncomplete ? "Partial Estimate (Some Activity Data Unavailable)" : "Complete Indicative Estimate",
      Reporting_Period: reportingPeriod,
      Household_Size: householdSize,
      Breakdown: breakdownRows,
      Categories_Map: {
        schoolCommute: schoolCommuteKg,
        dailyTravel: dailyTravelKg,
        electricity: allocatedElecKg,
        suppliesDevices: suppliesAndDevicesKg,
        foodWaste: totalFoodKg
      }
    };
  }

  // =========================================================================
  // 8. CONFIGURABLE ACHIEVEMENT BADGES (Fair & Child-Agency Focused)
  //    Never rewards or penalises children for household income/infrastructure!
  // =========================================================================
  const ACHIEVEMENT_BADGES_CONFIG = Object.freeze([
    {
      id: "water_warrior",
      name: "Water Warrior",
      icon: "💧",
      description: "Turns off taps, spots leaks, and protects every precious drop of water!",
      topicMatch: ["Water Conservation"]
    },
    {
      id: "energy_saver",
      name: "Energy Saver",
      icon: "⚡",
      description: "Switches off unused lights, fans, and gadgets and champions clean power!",
      topicMatch: ["Energy Conservation", "Digital Sustainability"]
    },
    {
      id: "nature_guardian",
      name: "Nature Guardian",
      icon: "🌿",
      description: "Protects trees, pollinators, butterflies, and local green habitats!",
      topicMatch: ["Nature & Biodiversity", "Climate Awareness", "Carbon Literacy"]
    },
    {
      id: "waste_warrior",
      name: "Waste Warrior",
      icon: "♻️",
      description: "Carries reusables, sorts waste into the right bins, and repairs/shares items!",
      topicMatch: ["Waste & Recycling", "Circular Economy", "Sustainable Purchasing", "Product Lifecycle"]
    },
    {
      id: "planet_protector",
      name: "Planet Protector",
      icon: "🌍",
      description: "Completed all 15 sustainability quests and missions with strong green habits!",
      isOverallBadge: true
    }
  ]);

  function evaluateAchievements(scoreSummary) {
    const badges = [];
    const cats = scoreSummary?.categories || {};

    ACHIEVEMENT_BADGES_CONFIG.forEach((badgeCfg) => {
      if (badgeCfg.isOverallBadge) {
        const earned = (scoreSummary?.Overall_Green_Score || 0) >= 60;
        badges.push({
          ...badgeCfg,
          unlocked: earned,
          progressText: earned ? "Unlocked! (60+ Green Score)" : `${scoreSummary?.Overall_Green_Score || 0}/60 Green Points to unlock`
        });
        return;
      }

      let earnedPts = 0;
      let maxPts = 0;
      badgeCfg.topicMatch.forEach((t) => {
        if (cats[t]) {
          earnedPts += cats[t].earned;
          maxPts += cats[t].max;
        }
      });

      const pct = maxPts > 0 ? Math.round((earnedPts / maxPts) * 100) : 75;
      const unlocked = pct >= 70;
      badges.push({
        ...badgeCfg,
        unlocked,
        scorePct: pct,
        progressText: unlocked ? `Unlocked! (${pct}% mastery)` : `${pct}% mastery (70% needed)`
      });
    });

    // Guarantee at least one encouraging badge is unlocked for every child who finishes
    if (!badges.some((b) => b.unlocked) && badges.length > 0) {
      badges[badges.length - 1].unlocked = true;
      badges[badges.length - 1].progressText = "Unlocked for completing all 15 activities!";
    }

    return badges;
  }

  // =========================================================================
  // 9. PERSONALISED CHILD-APPROPRIATE RECOMMENDATIONS ENGINE
  // =========================================================================
  function buildKidsRecommendations(ageGroup, scoreSummary, footprintSummary, missionsData) {
    const recs = [];
    const cats = scoreSummary?.categories || {};
    const dims = scoreSummary?.dimensions || {};
    const m5 = missionsData?.FP05 || {};
    const m1 = missionsData?.FP01 || {};

    // 1. Check lowest scoring topic categories from the 15 scored questions
    const sortedTopics = Object.entries(cats).sort((a, b) => (a[1].percentage || 0) - (b[1].percentage || 0));

    const topicAdviceMap = {
      "Water Conservation": {
        Category: "Water Conservation",
        Priority: "High",
        text8_10: "Turn off the tap while brushing your teeth or lathering soap, and tell a teacher or parent right away if you spot a dripping tap.",
        text11_14: "Practice turning off taps during daily routines and actively report leaking taps at home or school to prevent hidden water loss."
      },
      "Energy Conservation": {
        Category: "Energy Conservation",
        Priority: "High",
        text8_10: "Be the Room Captain! Switch off lights, fans, and the TV whenever you are the last person to leave a room, and open curtains to use natural daylight.",
        text11_14: "Audit your study space: switch off lights, fans, and chargers when not in use, and make the most of natural daylight during study hours."
      },
      "Waste & Recycling": {
        Category: "Waste & Recycling",
        Priority: "High",
        text8_10: "Pack a reusable water bottle and lunchbox for school every day, and sort fruit peels into wet compost and clean paper/plastic into dry recycling bins.",
        text11_14: "Replace single-use bottles and wrappers with a durable bottle and lunchbox, and help your class segregate wet organic waste from dry recyclables."
      },
      "Food Sustainability": {
        Category: "Food Sustainability",
        Priority: "Medium",
        text8_10: "Start with a portion you know you can finish—you can always ask for seconds! Help store safe leftovers in a container for later.",
        text11_14: "Take mindful portions at home and the school cafeteria to cut plate waste, and compost unavoidable fruit and vegetable scraps."
      },
      "Circular Economy": {
        Category: "Circular Economy",
        Priority: "Medium",
        text8_10: "Before asking for a new toy or stationery item, check if your current one can be repaired or share outgrown books and games with younger kids.",
        text11_14: "Extend product lifespans by reusing notebooks with blank pages, repairing bags or gadgets with an adult, and donating books you've outgrown."
      },
      "Nature & Biodiversity": {
        Category: "Nature & Biodiversity",
        Priority: "Medium",
        text8_10: "Water a plant at home or school, keep parks litter-free, and observe butterflies, bees, and birds peacefully without disturbing them.",
        text11_14: "Support local biodiversity by protecting native plants, joining supervised clean-up or plantation drives, and keeping green spaces plastic-free."
      },
      "Green Transport": {
        Category: "Green Transport",
        Priority: "Medium",
        text8_10: "For short, safe trips near home, ask a parent or guardian if you can walk or cycle together, or share rides with schoolmates.",
        text11_14: "Where safe and approved by a parent/guardian, walk, cycle, or use shared transport (school bus or carpool) for short local trips."
      }
    };

    sortedTopics.forEach(([topic, data]) => {
      if (recs.length >= 2) return;
      if ((data.percentage ?? 100) < 85 && topicAdviceMap[topic]) {
        const item = topicAdviceMap[topic];
        recs.push({
          Recommendation_ID: "REC_TOPIC_" + (recs.length + 1),
          Category: item.Category,
          Recommendation_Text: ageGroup === "11-14" ? item.text11_14 : item.text8_10,
          Priority: data.percentage < 60 ? "High" : "Medium",
          Completion_Status: "Suggested"
        });
      }
    });

    // 2. Check footprint missions for actionable child-level improvements
    if (m5.wasteFrequency === "sometimes" || m5.wasteFrequency === "often" || Number(m5.wasteGramsPerWeek) > 250) {
      recs.push({
        Recommendation_ID: "REC_FP_FOOD",
        Category: "Food & Food Waste",
        Recommendation_Text:
          ageGroup === "11-14"
            ? "Take smaller initial servings at meals and compost fruit/vegetable peels so edible food stays out of landfills."
            : "Serve yourself a smaller portion first and ask for more if you're still hungry—this keeps your plate clean and saves food!",
        Priority: "High",
        Completion_Status: "Suggested"
      });
    }

    if ((m1.mode === "car" || m1.mode === "two_wheeler") && Number(m1.oneWayKm) <= 2.5) {
      recs.push({
        Recommendation_ID: "REC_FP_COMMUTE",
        Category: "Green Mobility",
        Recommendation_Text:
          ageGroup === "11-14"
            ? "Since your travel distance is short, explore walking, cycling safely with an adult, or carpooling with neighbours when practical."
            : "For short trips near home, ask an adult if you can walk, cycle safely together, or share a ride with friends!",
        Priority: "Medium",
        Completion_Status: "Suggested"
      });
    }

    // Fill up to 4 well-rounded recommendations
    const fallbackOrder = ["Water Conservation", "Energy Conservation", "Waste & Recycling", "Nature & Biodiversity"];
    fallbackOrder.forEach((key) => {
      if (recs.length >= 4) return;
      const item = topicAdviceMap[key];
      if (item && !recs.some((r) => r.Category === item.Category)) {
        recs.push({
          Recommendation_ID: "REC_GEN_" + (recs.length + 1),
          Category: item.Category,
          Recommendation_Text: ageGroup === "11-14" ? item.text11_14 : item.text8_10,
          Priority: recs.length === 0 ? "High" : "Medium",
          Completion_Status: "Suggested"
        });
      }
    });

    // Ensure dimension-specific tip if Sustainable Habits or Practical Application was low
    if ((dims["Sustainable Habits"]?.earned || 0) < 21 && recs.length < 5) {
      recs.push({
        Recommendation_ID: "REC_HABIT_STREAK",
        Category: "Daily Green Habits",
        Recommendation_Text:
          ageGroup === "11-14"
            ? "Pick two daily habits—carrying a reusable bottle and switching off unused lights/devices—and track a 14-day streak."
            : "Try a 7-day Eco Hero Streak: carry your own water bottle and switch off unused lights every single day!",
        Priority: "High",
        Completion_Status: "Suggested"
      });
    }

    return recs.slice(0, 4);
  }

  window.MCCKidsData = Object.freeze({
    REQUIRED_DISTRIBUTION,
    getQuestionBank,
    selectBalancedQuestions,
    reconstructQuestionsFromOrder,
    getFootprintMissions: (ageGroup) => FOOTPRINT_MISSIONS[ageGroup === "11-14" ? "11-14" : "8-10"],
    getEmissionFactors,
    setEmissionFactors,
    evaluateSingleAnswer,
    calculateFullGreenScore,
    calculateKidsCarbonFootprint,
    evaluateAchievements,
    buildKidsRecommendations
  });
})();

