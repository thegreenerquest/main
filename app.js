// Optional: paste your deployed Google Apps Script Web App URL here, or set it via window.CARBON_QUEST_SAVE_URL in the HTML
const APPS_SCRIPT_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbwOlbi0_xKRZ6SQBMM4n6okFEYhtzBw1BnHLKlSH48RWjFABVm50RDRdJDM7WTfmW9I/exec';

const questionnaires = {
  school: {
    label: 'School',
    stages: [
      {
        title: 'Getting to school', icon: '↗', badge: 'Route Scout',
        description: 'Let’s start with the trip you make most school days. A rough estimate is great.',
        questions: [
          { id: 'school_mode', type: 'single', label: 'How do you usually travel to school?', options: ['School bus', 'Public transport', 'Family car', 'Two-wheeler', 'Bicycle', 'Walk', 'Other'] },
          { id: 'school_distance', type: 'number', label: 'About how far is home from school, one way?', help: 'A map estimate is fine.', unit: 'km', step: '0.1', max: '25' },
          { id: 'school_days', type: 'number', label: 'How many days a week do you travel to school?', unit: 'days / week', step: '1', max: '7' },
          { id: 'school_carpool', type: 'single', label: 'If you travel by car, do you share the ride?', options: ['Usually', 'Sometimes', 'Not usually', 'I do not travel by car', 'Not sure'] }
        ]
      },
      {
        title: 'Power at home', icon: '⌂', badge: 'Energy Detective',
        description: 'Think about your study space and the energy you use in a typical day.',
        questions: [
          { id: 'study_lights', type: 'single', label: 'How long are lights, fans, or AC on in your study area each day?', options: ['Under 2 hours', '2–4 hours', '5–8 hours', 'More than 8 hours', 'Not sure'] },
          { id: 'switch_off', type: 'single', label: 'Do you switch off lights and fans when you leave a room?', options: ['Almost always', 'Most of the time', 'Sometimes', 'Rarely', 'Not sure'] },
          { id: 'screen_hours', type: 'single', label: 'About how long do you use a computer, tablet, or TV each day?', options: ['Under 1 hour', '1–3 hours', '4–6 hours', 'More than 6 hours', 'Not sure'] },
          { id: 'home_solar', type: 'single', label: 'Does your home use solar energy?', options: ['Yes', 'No', 'Not sure'] },
          { id: 'home_electricity', type: 'single', label: 'Do you know your home’s monthly electricity use?', options: ['Yes, below 100 kWh', '100–300 kWh', '301–500 kWh', 'More than 500 kWh', 'I do not know'] },
          { id: 'school_monthly_kwh', type: 'number', label: 'If available, about how many kWh does your household use in a month?', help: 'An electricity bill may show this. Skip if you are not sure.', unit: 'kWh / month', step: '1', max: '100000' },
          { id: 'school_household_size', type: 'number', label: 'How many people share that household electricity use?', help: 'Used to estimate your share of the household total.', unit: 'people', step: '1', max: '10' }
        ]
      },
      {
        title: 'Food & everyday stuff', icon: '♡', badge: 'Mindful Muncher',
        description: 'There are no “right” kinds of meals here. We’re just curious about your usual routine.',
        questions: [
          { id: 'school_food_source', type: 'single', label: 'Where does most of your school-day food come from?', options: ['Packed from home', 'Bought at school', 'A mix of both', 'It varies', 'Not sure'] },
          { id: 'vegetarian_meals', type: 'single', label: 'How often are your meals vegetarian?', options: ['Every day', 'Most days', 'Some days', 'Rarely', 'Not sure'] },
          { id: 'food_leftovers', type: 'single', label: 'How often do you throw away leftover food?', options: ['Never or almost never', 'Once in a while', 'A few times a week', 'Most days', 'Not sure'] },
          { id: 'reusables', type: 'single', label: 'Do you carry a reusable water bottle or lunch box?', options: ['Both', 'A water bottle', 'A lunch box', 'Neither right now'] },
          { id: 'school_purchases', type: 'single', label: 'How often do you get new clothes, shoes, or school supplies?', options: ['Only when needed', 'A few times a year', 'Every month', 'Not sure'] }
        ]
      },
      {
        title: 'Waste & what you know', icon: '♧', badge: 'Waste Wise',
        description: 'Your final school checkpoint: how things get sorted and what you have noticed.',
        questions: [
          { id: 'household_separation', type: 'single', label: 'Does your household separate wet and dry waste?', options: ['Yes, regularly', 'Sometimes', 'No', 'Not sure'] },
          { id: 'school_recycling', type: 'multi', label: 'What does your household recycle? Choose all that apply.', help: 'Tap each one that fits.', options: ['Paper', 'Plastic', 'Metal', 'Glass', 'None of these', 'Not sure'], exclusive: ['None of these', 'Not sure'] },
          { id: 'food_waste_method', type: 'single', label: 'What usually happens to food scraps at home?', options: ['Composted', 'Collected separately', 'Put in mixed rubbish', 'Fed to animals', 'Not sure'] },
          { id: 'heard_footprint', type: 'single', label: 'Have you heard of a “carbon footprint”?', options: ['Yes, and I know what it means', 'I have heard the phrase', 'Not yet'] },
          { id: 'biggest_source', type: 'single', label: 'What do you think creates the most emissions in your daily life?', options: ['Travel', 'Electricity', 'Food', 'Shopping or waste', 'Not sure yet'] }
        ]
      }
    ]
  },
  college: {
    label: 'College',
    stages: [
      {
        title: 'Getting around', icon: '↗', badge: 'Route Scout',
        description: 'Commuting, shared rides, and flights all count as travel activity. Estimates are welcome.',
        questions: [
          { id: 'college_mode', type: 'single', label: 'What is your primary mode of transportation?', options: ['Walk or bicycle', 'Public transport', 'College or shuttle bus', 'Car', 'Two-wheeler', 'Taxi or ride-hail', 'Other'] },
          { id: 'college_distance', type: 'number', label: 'What is your average one-way commute to college?', unit: 'km', step: '0.1', max: '1000' },
          { id: 'college_days', type: 'number', label: 'How many days per week do you commute?', unit: 'days / week', step: '1', max: '7' },
          { id: 'vehicle_fuel', type: 'single', label: 'If you use a car or two-wheeler, what fuel does it use?', options: ['Petrol or gasoline', 'Diesel', 'CNG or LPG', 'Hybrid', 'Electric', 'I do not use one', 'Not sure'] },
          { id: 'ride_share', type: 'single', label: 'If you travel by car, how many people usually share the trip?', options: ['Just me', '2 people total', '3 or more people', 'I do not travel by car', 'Not sure'] },
          { id: 'taxi_frequency', type: 'single', label: 'How often do you use a taxi or ride-hailing service?', options: ['Never', 'Less than once a week', '1–3 times a week', '4 or more times a week'] },
          { id: 'domestic_flights', type: 'number', label: 'How many domestic flights have you taken in the past 12 months?', unit: 'flights', step: '1', max: '200' },
          { id: 'international_flights', type: 'number', label: 'How many international flights in the past 12 months?', unit: 'flights', step: '1', max: '200' }
        ]
      },
      {
        title: 'Electricity & devices', icon: '⌂', badge: 'Energy Detective',
        description: 'Your living setup helps put electricity use in context. Skip anything you cannot estimate.',
        questions: [
          { id: 'living_setup', type: 'single', label: 'Where do you live during term time?', options: ['With family', 'Hostel or dorm', 'Rented room', 'Shared apartment', 'Other'] },
          { id: 'monthly_kwh', type: 'number', label: 'Approximate monthly household or personal electricity use?', help: 'Check a bill if you have it. You can skip this.', unit: 'kWh / month', step: '1', max: '100000' },
          { id: 'ac_hours', type: 'number', label: 'About how many hours a day do you use air conditioning?', unit: 'hours / day', step: '0.5', max: '24' },
          { id: 'computer_hours', type: 'number', label: 'About how many hours a day do you use a laptop or desktop?', unit: 'hours / day', step: '0.5', max: '24' },
          { id: 'phone_hours', type: 'number', label: 'About how many hours a day do you use a smartphone?', unit: 'hours / day', step: '0.5', max: '24' },
          { id: 'college_solar', type: 'single', label: 'Does your residence use electricity from solar panels?', options: ['Yes', 'No', 'Not sure'] },
          { id: 'bill_sharers', type: 'number', label: 'If you share an electricity bill, how many people share it?', unit: 'people', step: '1', max: '10' }
        ]
      },
      {
        title: 'Food & purchases', icon: '♡', badge: 'Mindful Muncher',
        description: 'A quick look at what you eat, buy, and keep in circulation.',
        questions: [
          { id: 'meal_pattern', type: 'single', label: 'Which option best describes your usual meals?', options: ['Mostly vegetarian', 'Vegetarian with eggs', 'A mix of plant and meat meals', 'Meat most days', 'It varies / not sure'] },
          { id: 'meat_frequency', type: 'single', label: 'How often do you eat beef, mutton, chicken, or fish?', options: ['Never', 'Less than once a week', '1–3 times a week', '4 or more times a week', 'Not sure'] },
          { id: 'food_waste_kg', type: 'number', label: 'How much food do you estimate you waste in a typical week?', unit: 'kg / week', step: '0.1', max: '100' },
          { id: 'delivery_frequency', type: 'single', label: 'How often do you order food for delivery?', options: ['Never', 'Less than once a week', '1–3 times a week', '4 or more times a week'] },
          { id: 'clothing_count', type: 'number', label: 'How many new clothing items do you buy in a typical month?', unit: 'items / month', step: '1', max: '100' },
          { id: 'device_replacement', type: 'single', label: 'How often do you replace an electronic device?', options: ['Every year or sooner', 'Every 2–3 years', 'Every 4+ years', 'Only when it stops working', 'Not sure'] },
          { id: 'secondhand', type: 'single', label: 'Do you buy second-hand products or reuse items?', options: ['Often', 'Sometimes', 'Rarely', 'Not yet'] }
        ]
      },
      {
        title: 'Waste & circular habits', icon: '♧', badge: 'Waste Wise',
        description: 'How waste is handled matters too—from food scraps to old electronics.',
        questions: [
          { id: 'residence_waste', type: 'single', label: 'How is waste managed where you live?', options: ['Separate collection / recycling', 'Mixed general waste', 'I take it to a collection point', 'Not sure'] },
          { id: 'college_separation', type: 'single', label: 'Do you separate biodegradable and non-biodegradable waste?', options: ['Yes, regularly', 'Sometimes', 'No', 'Not sure'] },
          { id: 'disposables', type: 'single', label: 'How often do you use disposable cups, plates, or cutlery?', options: ['Never or almost never', 'A few times a month', 'A few times a week', 'Most days'] },
          { id: 'ewaste', type: 'single', label: 'How do you dispose of electronic waste?', options: ['Official e-waste collection', 'Retailer take-back', 'Donate or pass it on', 'General rubbish', 'I keep it / not sure'] },
          { id: 'compost', type: 'single', label: 'Do you compost food waste or send it for composting?', options: ['Yes, regularly', 'Sometimes', 'No', 'Not sure'] }
        ]
      },
      {
        title: 'Carbon & climate choices', icon: '✧', badge: 'Climate Curious',
        description: 'This final stage is about awareness and trust—not a test, and there are no wrong answers.',
        questions: [
          { id: 'calculated_footprint', type: 'single', label: 'Have you ever calculated your personal carbon footprint?', options: ['Yes', 'No', 'Not sure'] },
          { id: 'offsets_difference', type: 'single', label: 'Do you know the difference between emissions and carbon offsets?', options: ['Yes, I can explain it', 'I have a rough idea', 'Not yet'] },
          { id: 'heard_credits', type: 'single', label: 'Have you heard of carbon credits?', options: ['Yes, and I know what they are', 'I have heard the term', 'Not yet'] },
          { id: 'verified_project', type: 'single', label: 'Would you consider supporting a verified climate project?', options: ['Yes', 'Maybe, with more information', 'No', 'Not sure'] },
          { id: 'project_preference', type: 'multi', label: 'Which project types would you be interested in? Choose all that apply.', options: ['Afforestation', 'Forest conservation', 'Renewable energy', 'Another verified project', 'Not sure yet'], exclusive: ['Not sure yet'] },
          { id: 'project_evidence', type: 'multi', label: 'What evidence would help you trust a climate project? Choose all that apply.', options: ['Independent verification', 'Clear project data', 'Evidence of monitoring', 'Transparent costs', 'Community benefit information', 'Not sure yet'], exclusive: ['Not sure yet'] },
          { id: 'emissions_dashboard', type: 'single', label: 'Would you use a dashboard showing annual emissions in tonnes of CO₂e?', options: ['Yes', 'Maybe', 'No', 'Not sure'] },
          { id: 'campus_program', type: 'single', label: 'Would you join a carbon accounting programme at college or work?', options: ['Yes', 'Maybe', 'No', 'Not sure'] }
        ]
      }
    ]
  },
  employee: {
    label: 'Employee',
    stages: [
      {
        title: 'Getting to work', icon: '↗', badge: 'Commute Navigator',
        description: 'Think about a usual work week. If your schedule changes, use an average.',
        questions: [
          { id: 'work_setup', type: 'single', label: 'Which best describes your usual work setup?', options: ['Mostly on-site', 'Hybrid', 'Mostly remote', 'Field-based / travel between sites', 'It varies'] },
          { id: 'workplace_days', type: 'number', label: 'About how many days a week do you travel to a workplace?', unit: 'days / week', step: '1', max: '7' },
          { id: 'employee_mode', type: 'single', label: 'What is your usual way of getting to work?', options: ['Walk or bicycle', 'Public transport', 'Company shuttle', 'Car', 'Two-wheeler', 'Taxi or ride-hail', 'Mostly work from home', 'Other'] },
          { id: 'employee_distance', type: 'number', label: 'What is your average one-way commute distance?', unit: 'km', step: '0.1', max: '1000' },
          { id: 'employee_fuel', type: 'single', label: 'If you use a car or two-wheeler, what fuel does it use?', options: ['Petrol or gasoline', 'Diesel', 'CNG or LPG', 'Hybrid', 'Electric', 'I do not use one', 'Not sure'] },
          { id: 'employee_carpool', type: 'single', label: 'If you drive, how many people usually share the trip?', options: ['Just me', '2 people total', '3 or more people', 'I do not drive', 'Not sure'] },
          { id: 'work_flights', type: 'single', label: 'How often do you take flights for work?', options: ['Never', 'Once or twice a year', 'A few times a year', 'Monthly or more', 'Not sure'] }
        ]
      },
      {
        title: 'Energy & digital work', icon: '⌂', badge: 'Power Scout',
        description: 'Include your main work location—home, office, or both. Rough estimates are okay.',
        questions: [
          { id: 'remote_days', type: 'number', label: 'How many days a week do you work from home?', unit: 'days / week', step: '1', max: '7' },
          { id: 'employee_computer_hours', type: 'number', label: 'About how many hours a day do you use a work computer?', unit: 'hours / day', step: '0.5', max: '24' },
          { id: 'device_powerdown', type: 'single', label: 'Do you switch off work devices when they are not in use?', options: ['Almost always', 'Most of the time', 'Sometimes', 'Rarely', 'Not sure'] },
          { id: 'cooling_hours', type: 'single', label: 'How much cooling or air conditioning is used in your main work space?', options: ['None or very little', 'A few hours a day', 'Most of the work day', 'All day', 'Not sure'] },
          { id: 'office_renewable', type: 'single', label: 'Does your workplace use renewable electricity, such as solar?', options: ['Yes', 'No', 'Not sure'] },
          { id: 'office_energy_data', type: 'single', label: 'Can you access energy-use information for your workplace?', options: ['Yes, regularly', 'Sometimes', 'No', 'Not sure'] }
        ]
      },
      {
        title: 'Meals & purchases', icon: '♡', badge: 'Mindful Colleague',
        description: 'A snapshot of your workday meals, deliveries, and the things you buy.',
        questions: [
          { id: 'work_food_source', type: 'single', label: 'Where do most of your workday meals come from?', options: ['Prepared at home', 'Work cafeteria', 'Bought nearby', 'Food delivery', 'A mix / it varies'] },
          { id: 'employee_meal_pattern', type: 'single', label: 'Which option best describes your usual meals?', options: ['Mostly vegetarian', 'Vegetarian with eggs', 'A mix of plant and meat meals', 'Meat most days', 'It varies / not sure'] },
          { id: 'work_food_waste', type: 'single', label: 'How often do you throw away edible food from workday meals?', options: ['Never or almost never', 'Once in a while', 'A few times a week', 'Most workdays', 'Not sure'] },
          { id: 'work_delivery', type: 'single', label: 'How often do you order food for delivery during the work week?', options: ['Never', 'Less than once a week', '1–3 times a week', '4 or more times a week'] },
          { id: 'work_reusables', type: 'single', label: 'Do you use a reusable cup, bottle, or lunch container at work?', options: ['Most days', 'Sometimes', 'Rarely', 'Not right now'] },
          { id: 'work_device_replacement', type: 'single', label: 'How often are your work devices replaced?', options: ['Every year or sooner', 'Every 2–3 years', 'Every 4+ years', 'Only when needed', 'Not sure'] }
        ]
      },
      {
        title: 'Office waste & reuse', icon: '♧', badge: 'Circularity Champion',
        description: 'Look at what gets reused, sorted, recycled, or thrown away at work.',
        questions: [
          { id: 'office_separation', type: 'single', label: 'Does your workplace separate recycling from general waste?', options: ['Yes, clearly', 'Some materials', 'No', 'Not sure'] },
          { id: 'office_disposables', type: 'single', label: 'How often do you use disposable cups, plates, or cutlery at work?', options: ['Never or almost never', 'A few times a month', 'A few times a week', 'Most workdays'] },
          { id: 'office_ewaste', type: 'single', label: 'How are old electronics usually handled at your workplace?', options: ['Certified e-waste collection', 'Returned to supplier', 'Reused or donated', 'General rubbish', 'Not sure'] },
          { id: 'office_supplies', type: 'single', label: 'Are office supplies reused or shared where you work?', options: ['Usually', 'Sometimes', 'Rarely', 'Not sure'] },
          { id: 'office_food_scraps', type: 'single', label: 'Is food-scrap composting available at your workplace?', options: ['Yes', 'No', 'Not sure'] }
        ]
      },
      {
        title: 'Workplace climate culture', icon: '✧', badge: 'Climate Connector',
        description: 'This last checkpoint is about what your workplace tracks and the changes you would support.',
        questions: [
          { id: 'employee_footprint', type: 'single', label: 'Have you ever calculated your personal carbon footprint?', options: ['Yes', 'No', 'Not sure'] },
          { id: 'employer_climate_plan', type: 'single', label: 'Does your employer have a climate or emissions plan?', options: ['Yes, with visible goals', 'I have heard about one', 'No', 'Not sure'] },
          { id: 'work_emissions_reporting', type: 'single', label: 'Does your workplace share information about its emissions?', options: ['Yes, regularly', 'Sometimes', 'No', 'Not sure'] },
          { id: 'work_carbon_credits', type: 'single', label: 'Would you consider supporting a verified climate project through work?', options: ['Yes', 'Maybe, with more information', 'No', 'Not sure'] },
          { id: 'work_project_types', type: 'multi', label: 'Which verified project types interest you? Choose all that apply.', options: ['Afforestation', 'Forest conservation', 'Renewable energy', 'Another verified project', 'Not sure yet'], exclusive: ['Not sure yet'] },
          { id: 'work_project_evidence', type: 'multi', label: 'What evidence would help you trust a climate project? Choose all that apply.', options: ['Independent verification', 'Clear project data', 'Evidence of monitoring', 'Transparent costs', 'Community benefits', 'Not sure yet'], exclusive: ['Not sure yet'] },
          { id: 'employee_program', type: 'single', label: 'Would you join a workplace programme to track and reduce emissions?', options: ['Yes', 'Maybe', 'No', 'Not sure'] }
        ]
      }
    ]
  }
};

const juniorSchoolQuestionnaire = {
  label: 'School',
  stages: [
    {
      title: 'School Trip Superstars', icon: '🚌', badge: 'Route Rocket',
      description: 'Blast off! Tell us how you usually travel and how far your school is from home.',
      questions: [
        { id: 'school_mode', type: 'single', label: 'How do you usually get to school?', options: ['School bus', 'Public transport', 'Family car', 'Two-wheeler', 'Bicycle', 'Walk', 'Other'] },
        { id: 'school_distance', type: 'number', label: 'About how many kilometres is home from school, one way?', help: 'A grown-up can help you check a map. Up to 25 km.', unit: 'km', step: '0.1', max: '25' }
      ]
    },
    {
      title: 'Energy Power-Up', icon: '⚡', badge: 'Energy Hero',
      description: 'Power up your planet smarts! If you can, ask a grown-up to check your home electricity bill.',
      questions: [
        { id: 'school_monthly_kwh', type: 'number', label: 'How much electricity does your home use in a month?', help: 'Look for kWh on the bill with a grown-up. It’s okay to skip if you can’t find it.', unit: 'kWh / month', step: '1', max: '100000' },
        { id: 'school_household_size', type: 'number', label: 'How many people share the electricity at home?', help: 'Count everyone who lives in your home.', unit: 'people', step: '1', max: '10' }
      ]
    },
    {
      title: 'Food Hero Challenge', icon: '🍎', badge: 'Food Friend',
      description: 'Food heroes help good food find a happy ending. What happens at your home?',
      questions: [
        { id: 'vegetarian_meals', type: 'single', label: 'How often do you eat vegetarian meals?', options: ['Every day', 'Most days', 'Some days', 'Rarely', 'Not sure'] },
        { id: 'food_leftovers', type: 'single', label: 'How often does leftover food get thrown away at home?', options: ['Never or almost never', 'Once in a while', 'A few times a week', 'Most days', 'Not sure'] }
      ]
    },
    {
      title: 'Waste Wizard Mission', icon: '♻️', badge: 'Waste Wizard',
      description: 'You’re on a sorting mission! Find out what happens to rubbish and food scraps at home.',
      questions: [
        { id: 'household_separation', type: 'single', label: 'Does your household sort wet and dry rubbish separately?', options: ['Yes, regularly', 'Sometimes', 'No', 'Not sure'] },
        { id: 'food_waste_method', type: 'single', label: 'What usually happens to food scraps at home?', options: ['Composted', 'Collected separately', 'Put in mixed rubbish', 'Fed to animals', 'Not sure'] }
      ]
    },
    {
      title: 'Planet Detective Finale', icon: '🌎', badge: 'Planet Protector',
      description: 'Final level! Put on your detective hat and share what you know about our planet.',
      questions: [
        { id: 'heard_footprint', type: 'single', label: 'Have you heard of a carbon footprint?', options: ['Yes, and I know what it means', 'I have heard the phrase', 'Not yet'] },
        { id: 'biggest_source', type: 'single', label: 'What do you think creates the most emissions in daily life?', options: ['Travel', 'Electricity', 'Food', 'Shopping or waste', 'Not sure yet'] }
      ]
    }
  ]
};

const individualQuestionnaire = {
  label: 'Individual',
  stages: [
    {
      title: 'Everyday Travel', icon: '🚲', badge: 'Route Ranger',
      description: 'Start with the journeys you make in a typical week. Estimates are welcome.',
      questions: [
        { id: 'individual_mode', type: 'single', label: 'What is your most common way to travel?', options: ['Walk or bicycle', 'Public transport', 'Car', 'Two-wheeler', 'Taxi or ride-hail', 'Other'] },
        { id: 'individual_distance', type: 'number', label: 'About how far is your usual one-way trip?', unit: 'km', step: '0.1', max: '1000' },
        { id: 'individual_days', type: 'number', label: 'How many days a week do you make this trip?', unit: 'days / week', step: '1', max: '7' },
        { id: 'individual_carpool', type: 'single', label: 'If you travel by car, how many people share the ride?', options: ['Just me', '2 people total', '3 or more people', 'I do not travel by car', 'Not sure'] }
      ]
    },
    {
      title: 'Home Energy', icon: '⚡', badge: 'Energy Pathfinder',
      description: 'Look at the energy used in your home. You can check a bill or ask someone you live with.',
      questions: [
        { id: 'individual_monthly_kwh', type: 'number', label: 'How much electricity does your home use in a month?', help: 'Find the kWh amount on a bill. Skip if you cannot access it.', unit: 'kWh / month', step: '1', max: '100000' },
        { id: 'individual_household_size', type: 'number', label: 'How many people share this electricity use?', unit: 'people', step: '1', max: '10' },
        { id: 'individual_solar', type: 'single', label: 'Does your home use solar electricity?', options: ['Yes', 'No', 'Not sure'] }
      ]
    },
    {
      title: 'Food & Buying Habits', icon: '🥗', badge: 'Mindful Maker',
      description: 'Your everyday meals and shopping habits are part of your activity snapshot too.',
      questions: [
        { id: 'individual_meals', type: 'single', label: 'Which best describes your usual meals?', options: ['Mostly vegetarian', 'Vegetarian with eggs', 'A mix of plant and meat meals', 'Meat most days', 'It varies / not sure'] },
        { id: 'individual_meat_frequency', type: 'single', label: 'How often do you eat meat or fish?', options: ['Never', 'Less than once a week', '1–3 times a week', '4 or more times a week', 'Not sure'] },
        { id: 'individual_food_waste_kg', type: 'number', label: 'How much food do you think you throw away in a typical week?', unit: 'kg / week', step: '0.1', max: '100' },
        { id: 'individual_clothing_count', type: 'number', label: 'How many new clothing items do you buy in a typical month?', unit: 'items / month', step: '1', max: '100' }
      ]
    },
    {
      title: 'Waste & Reuse', icon: '♻️', badge: 'Circularity Captain',
      description: 'Find out what happens to recycling, old electronics, and single-use items around you.',
      questions: [
        { id: 'individual_waste', type: 'single', label: 'How is waste managed where you live?', options: ['Separate collection / recycling', 'Mixed general waste', 'I take it to a collection point', 'Not sure'] },
        { id: 'individual_disposables', type: 'single', label: 'How often do you use disposable cups, plates, or cutlery?', options: ['Never or almost never', 'A few times a month', 'A few times a week', 'Most days'] },
        { id: 'individual_ewaste', type: 'single', label: 'What do you do with old electronics?', options: ['Official e-waste collection', 'Retailer take-back', 'Donate or pass them on', 'General rubbish', 'Keep them / not sure'] }
      ]
    },
    {
      title: 'Climate Choices', icon: '🌎', badge: 'Climate Explorer',
      description: 'Final checkpoint! Tell us what you know and the changes you might like to explore.',
      questions: [
        { id: 'individual_footprint', type: 'single', label: 'Have you ever calculated your carbon footprint?', options: ['Yes', 'No', 'Not sure'] },
        { id: 'individual_offsets', type: 'single', label: 'Do you know what a carbon offset is?', options: ['Yes, I can explain it', 'I have a rough idea', 'Not yet'] },
        { id: 'individual_project_interest', type: 'multi', label: 'Which climate project types interest you? Choose all that apply.', options: ['Afforestation', 'Forest conservation', 'Renewable energy', 'Another verified project', 'Not sure yet'], exclusive: ['Not sure yet'] }
      ]
    }
  ]
};

const OPTIONAL_QUESTION_IDS = {
  junior: ['school_monthly_kwh'],
  senior: ['school_monthly_kwh', 'school_purchases', 'biggest_source'],
  college: ['domestic_flights', 'international_flights', 'monthly_kwh', 'food_waste_kg', 'project_evidence'],
  employee: ['remote_days', 'employee_computer_hours', 'work_flights', 'office_energy_data'],
  individual: ['individual_monthly_kwh', 'individual_food_waste_kg']
};

const pageTrack = document.body.dataset.track || 'school';
let selectedTrack = pageTrack;
let activeTrack = pageTrack;
let activeStage = 0;
let answers = {};
let stageScores = {};
let lastScore = null;
let toastTimer;
let selectedCountry = '';
let participantEmail = '';
let participantName = '';
let participantAge = '';
let participantCity = '';
let submissionStarted = false;
let selectedSchoolLevel = pageTrack === 'school' ? (document.body.dataset.schoolLevel || 'senior') : null;

const GRID_FACTORS = {
  australia: { name: 'Australia', kgPerKwh: 0.525, gPerKwh: 525, year: 2025 },
  china: { name: 'China', kgPerKwh: 0.525, gPerKwh: 525, year: 2025 },
  europe: { name: 'Europe', kgPerKwh: 0.210, gPerKwh: 210, year: 2025 },
  global: { name: 'Global average (other country)', kgPerKwh: 0.458, gPerKwh: 458, year: 2025 },
  india: { name: 'India', kgPerKwh: 0.670, gPerKwh: 670, year: 2025 },
  japan: { name: 'Japan', kgPerKwh: 0.477, gPerKwh: 477, year: 2025 },
  'united-kingdom': { name: 'United Kingdom', kgPerKwh: 0.2174, gPerKwh: 217.4, year: 2025 },
  'united-states': { name: 'United States', kgPerKwh: 0.384, gPerKwh: 384, year: 2025 }
};

const TRAVEL_FACTORS = {
  car: 0.16591,
  bus: 0.10151,
  motorbike: 0.11367,
  taxi: 0.14861
};

const $ = (selector) => document.querySelector(selector);
const heroPathButtons = document.querySelectorAll('.pathway-option');
const schoolLevelButtons = document.querySelectorAll('.school-level-option');
const questSection = $('#quest');
const resultsSection = $('#results');
const stagePanel = $('#stage-panel');
let celebrationTimeout;

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
}

function activeQuestionnaire(track = activeTrack) {
  if (track === 'school' && selectedSchoolLevel === 'junior') return juniorSchoolQuestionnaire;
  if (track === 'individual') return individualQuestionnaire;
  return questionnaires[track];
}

function pathDisplayLabel(track = activeTrack) {
  return track === 'school' ? `${selectedSchoolLevel === 'junior' ? 'Junior' : 'Senior'} School` : activeQuestionnaire(track).label;
}

function selectSchoolLevel(level) {
  if (questSection && !questSection.hidden) {
    showToast('Finish this quest before changing school levels.');
    return;
  }
  if (resultsSection && !resultsSection.hidden) {
    resultsSection.hidden = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  selectedSchoolLevel = level === 'junior' ? 'junior' : 'senior';
  schoolLevelButtons.forEach((button) => {
    const selected = button.dataset.schoolLevel === selectedSchoolLevel;
    button.classList.toggle('is-active', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
  const junior = selectedSchoolLevel === 'junior';
  $('#start-button').innerHTML = `Start ${junior ? 'Junior' : 'Senior'} quest <span aria-hidden="true">↗</span>`;
  $('#path-question-count').textContent = junior ? '10 quick questions · about 3 minutes' : '21 questions · about 5 minutes';
  $('#path-time-note').innerHTML = `◷ &nbsp;About ${junior ? '3' : '5'} minutes`;
  $('#school-level-icon').textContent = junior ? '🧭' : '🌿';
  $('#school-level-title').textContent = junior ? 'Junior Explorer' : 'Senior School Explorer';
  $('#school-level-meta').textContent = junior ? '5 mini quests · 5 badges' : '4 field missions · 4 badges';
}

schoolLevelButtons.forEach((button) => button.addEventListener('click', () => selectSchoolLevel(button.dataset.schoolLevel)));

function allQuestions(track = activeTrack) {
  return activeQuestionnaire(track).stages.flatMap((stage, stageIndex) => stage.questions.map((question) => ({ ...question, stageIndex, stageTitle: stage.title })));
}

function requiredQuestionSet(track = activeTrack) {
  const questions = allQuestions(track);
  const key = track === 'school' ? selectedSchoolLevel : track;
  const optionalIds = new Set(OPTIONAL_QUESTION_IDS[key] || []);
  const minimumRequired = Math.ceil(questions.length * 0.85);
  return new Set(questions.filter((question) => !optionalIds.has(question.id)).slice(0, minimumRequired).map((question) => question.id));
}

function isRequiredQuestion(question, track = activeTrack) {
  return requiredQuestionSet(track).has(question.id);
}

function answerExists(question) {
  const value = answers[question.id];
  if (Array.isArray(value)) return value.length > 0;
  return value !== undefined && value !== null && String(value).trim() !== '';
}

function answeredQuestions(track = activeTrack) {
  return allQuestions(track).filter(answerExists);
}

function completedStages(track = activeTrack) {
  return activeQuestionnaire(track).stages.filter((stage, index) => stageScores[index] !== undefined && stage.questions.filter((question) => isRequiredQuestion(question, track)).every(answerExists)).length;
}

function currentXP() {
  return Object.values(stageScores).reduce((total, points) => total + points, 0);
}

function selectPath(path) {
  selectedTrack = path;
  heroPathButtons.forEach((button) => {
    const selected = button.dataset.path === path;
    button.classList.toggle('is-active', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
}

heroPathButtons.forEach((button) => button.addEventListener('click', () => selectPath(button.dataset.path)));

function renderQuestion(question, index) {
  const current = answers[question.id];
  const required = isRequiredQuestion(question);
  const requirementBadge = `<span class="question-requirement${required ? ' is-required' : ''}">${required ? 'Required' : 'Optional'}</span>`;
  let control;
  if (question.type === 'number') {
    const questionId = escapeHtml(question.id);
    const unit = escapeHtml(question.unit || '');
    const max = Number(question.max || 100);
    const sliderMax = Math.min(Number.isFinite(max) && max > 0 ? max : 100, 1000);
    const value = current === undefined ? '' : escapeHtml(current);
    const sliderValue = current === undefined ? 0 : Math.min(Number(current) || 0, sliderMax);
    const valueLabel = current === undefined ? 'Choose a value or type one' : `${escapeHtml(current)}${unit ? ` ${unit}` : ''}`;
    const numberHint = sliderMax < max
      ? `Slider to ${sliderMax}${unit ? ` ${unit}` : ''}; type a larger value if needed. ${required ? 'Required.' : 'Optional.'}`
      : `Use the slider or enter a number. ${required ? 'Required.' : 'Optional.'}`;
    control = `<div class="number-control"><div class="number-wrap"><input type="number" inputmode="decimal" id="answer-${questionId}" data-action="number" data-question="${questionId}" aria-label="${escapeHtml(question.label)} number entry" min="0"${question.max ? ` max="${escapeHtml(question.max)}"` : ''} step="${escapeHtml(question.step || '1')}" placeholder="Your estimate" value="${value}"${required ? ' required' : ''}/><span class="number-unit">${unit}</span></div><div class="range-wrap"><input class="number-range" type="range" id="slider-${questionId}" data-action="range" data-question="${questionId}" min="0" max="${sliderMax}" step="${escapeHtml(question.step || '1')}" value="${sliderValue}" aria-label="${escapeHtml(question.label)} slider" aria-controls="answer-${questionId}" aria-describedby="range-value-${questionId}"/><output class="range-value" id="range-value-${questionId}" for="slider-${questionId}">${valueLabel}</output></div><span class="number-hint">${numberHint}</span></div>`;
  } else {
    const isMulti = question.type === 'multi';
    const selectedValues = Array.isArray(current) ? current : current ? [current] : [];
    const options = question.options.map((option) => {
      const selected = selectedValues.includes(option);
      return `<button type="button" class="answer-option${isMulti ? ' multi' : ''}" data-action="answer" data-question="${escapeHtml(question.id)}" data-value="${escapeHtml(option)}" aria-pressed="${selected}">${escapeHtml(option)}</button>`;
    }).join('');
    control = `${question.help ? `<p class="question-help">${escapeHtml(question.help)}</p>` : ''}<div class="answer-options" role="group" aria-label="${escapeHtml(question.label)}${isMulti ? ' Choose all that apply' : ''}" aria-required="${required}">${options}</div>`;
  }
  return `<div class="question-card${required ? ' is-required-question' : ''}" role="group" aria-labelledby="label-${escapeHtml(question.id)}"><div class="question-heading"><span class="question-number">${index + 1}</span><h4 id="label-${escapeHtml(question.id)}">${escapeHtml(question.label)}</h4>${requirementBadge}</div>${control}</div>`;
}

function renderStage() {
  const questionnaire = activeQuestionnaire();
  const stage = questionnaire.stages[activeStage];
  const stages = questionnaire.stages;
  const questions = stage.questions.map((question, index) => renderQuestion(question, index)).join('');
  const stageRequiredTotal = stage.questions.filter((question) => isRequiredQuestion(question)).length;
  const stageRequiredAnswered = stage.questions.filter((question) => isRequiredQuestion(question) && answerExists(question)).length;
  const checkpoint = lastScore?.nextIndex === activeStage ? renderCheckpoint(lastScore) : '';
  const emailPrompt = activeStage === stages.length - 1
    ? `<div class="final-email-card"><div class="final-email-copy"><span class="card-kicker">YOUR PDF REPORT</span><strong>Add your details to unlock the download</strong><small>A valid email address is needed before you finish. Name, age, and city are optional.</small></div><div class="participant-details-fields"><label class="email-picker" for="participant-name"><span>Name <small>(optional)</small></span><input id="participant-name" type="text" name="name" autocomplete="name" maxlength="120" placeholder="Your name" value="${escapeHtml(participantName)}" /></label><label class="email-picker" for="participant-age"><span>Age <small>(optional)</small></span><input id="participant-age" type="number" name="age" autocomplete="off" inputmode="numeric" min="1" max="120" step="1" placeholder="Age" value="${escapeHtml(participantAge)}" /></label><label class="email-picker" for="participant-city"><span>City <small>(optional)</small></span><input id="participant-city" type="text" name="city" autocomplete="address-level2" maxlength="100" placeholder="City" value="${escapeHtml(participantCity)}" /></label><label class="email-picker" for="participant-email"><span>Email address</span><input id="participant-email" type="email" name="email" autocomplete="email" maxlength="254" placeholder="you@example.com" value="${escapeHtml(participantEmail)}" required /></label></div></div>`
    : '';
  stagePanel.innerHTML = `${checkpoint}<div class="stage-panel-head"><div><div class="stage-overline">SECTION ${activeStage + 1} · FIELD BADGE: ${escapeHtml(stage.badge)}</div><h3>${escapeHtml(stage.title)}</h3><p>${escapeHtml(stage.description)}</p></div><span class="stage-count-badge">${stage.questions.filter(answerExists).length} / ${stage.questions.length} answered</span></div><div class="section-required-progress" id="section-required-progress" role="status"><strong>${stageRequiredAnswered} of ${stageRequiredTotal} required answers complete</strong><span>Required questions are marked. Optional questions can be skipped.</span></div><div class="question-grid">${questions}</div>${emailPrompt}`;
  $('#stage-counter').textContent = `SECTION ${activeStage + 1} OF ${stages.length}`;
  $('#previous-stage').disabled = activeStage === 0;
  $('#previous-stage').textContent = '← Previous section';
  $('#next-stage').innerHTML = activeStage === stages.length - 1 ? 'Finish my quest <span aria-hidden="true">↗</span>' : 'Next section <span aria-hidden="true">→</span>';
  $('#quest-title').textContent = `${pathDisplayLabel()} quest`;
  $('#quest-subtitle').textContent = activeTrack === 'school'
    ? selectedSchoolLevel === 'junior'
      ? 'Five fun mini quests, two questions each, and a new planet badge to collect every round!'
      : 'A few questions about everyday school life. “Not sure” is a perfectly good answer.'
    : activeTrack === 'college'
      ? 'A detailed activity snapshot for college life. Estimates are fine, and you can skip anything you don’t know.'
      : activeTrack === 'employee'
        ? 'A workplace activity snapshot for employees. Estimates are fine, and you can skip anything you don’t know.'
        : 'A personal activity snapshot of travel, home energy, food, shopping, and waste.';
  updateQuestChrome();
}

function renderCheckpoint(score) {
  const junior = activeTrack === 'school' && selectedSchoolLevel === 'junior';
  const badgeStatus = score.badgeEarned
    ? `<small class="badge-unlocked">✦ ${escapeHtml(score.badge)} badge unlocked!</small>`
    : '<small>Badge progress saved—keep going!</small>';
  const confetti = score.badgeEarned ? '<span class="checkpoint-confetti confetti-a" aria-hidden="true">✦</span><span class="checkpoint-confetti confetti-b" aria-hidden="true">✳</span><span class="checkpoint-confetti confetti-c" aria-hidden="true">●</span><span class="checkpoint-confetti confetti-d" aria-hidden="true">✦</span>' : '';
  return `<div class="checkpoint-card${score.badgeEarned ? ' badge-earned' : ''}" role="status">${confetti}<span class="checkpoint-spark" aria-hidden="true">${score.badgeEarned ? (junior ? '🌟' : '✦') : '✧'}</span><div class="checkpoint-copy"><span class="checkpoint-kicker">${junior ? 'MINI QUEST COMPLETE' : 'SECTION COMPLETE'} · ${escapeHtml(score.title)}</span><strong>${score.answered} / ${score.total} answers <span class="xp-reward">+${score.points} XP</span></strong>${badgeStatus}</div><div class="checkpoint-total"><strong>${score.totalXP} XP</strong><small>${junior ? 'star points' : 'total so far'}</small></div><button class="checkpoint-dismiss" type="button" data-dismiss-score aria-label="Dismiss score summary">×</button></div>`;
}

function showSectionCelebration(score) {
  let popup = $('#section-celebration');
  if (!popup) {
    popup = document.createElement('div');
    popup.id = 'section-celebration';
    popup.className = 'section-celebration';
    popup.setAttribute('role', 'status');
    popup.setAttribute('aria-live', 'polite');
    popup.setAttribute('aria-atomic', 'true');
    document.body.append(popup);
  }

  const tier = ['Platinum', 'Gold', 'Silver', 'Bronze'].includes(score.tier) ? score.tier.toLowerCase() : '';
  popup.className = `section-celebration${tier ? ` has-tier tier-${tier}` : ''}`;
  const reward = score.badgeEarned
    ? `${score.badge} badge unlocked!`
    : `${score.answered} of ${score.total} answers counted`;
  const tierMarkup = tier
    ? `<div class="celebration-tier-mark"><span class="celebration-coin" aria-hidden="true">✦</span><span class="celebration-tier-label">${escapeHtml(score.tier)} carbon tier</span></div>`
    : '';
  const junior = activeTrack === 'school' && selectedSchoolLevel === 'junior';
  popup.innerHTML = `<div class="celebration-card"><div class="leaf-burst" aria-hidden="true"><span class="celebration-leaf leaf-one"></span><span class="celebration-leaf leaf-two"></span><span class="celebration-leaf leaf-three"></span><span class="celebration-leaf leaf-four"></span><span class="celebration-leaf leaf-five"></span><span class="celebration-leaf leaf-six"></span><span class="celebration-leaf leaf-seven"></span><span class="celebration-leaf leaf-eight"></span><span class="celebration-leaf leaf-nine"></span><span class="celebration-leaf leaf-ten"></span><span class="celebration-leaf tier-leaf tier-leaf-one"></span><span class="celebration-leaf tier-leaf tier-leaf-two"></span><span class="celebration-leaf tier-leaf tier-leaf-three"></span><span class="celebration-leaf tier-leaf tier-leaf-four"></span></div><span class="celebration-overline">${junior ? 'MINI QUEST COMPLETE · LEVEL UP!' : 'SECTION COMPLETE'}</span><strong class="celebration-title">${escapeHtml(score.title)}</strong><span class="celebration-reward">${junior ? '🌟 ' : ''}+${score.points} XP <i aria-hidden="true">·</i> ${escapeHtml(reward)}</span>${tierMarkup}</div>`;
  popup.hidden = false;
  popup.classList.remove('is-celebrating');
  void popup.offsetWidth;
  popup.classList.add('is-celebrating');
  window.clearTimeout(celebrationTimeout);
  celebrationTimeout = window.setTimeout(() => {
    popup.hidden = true;
    popup.classList.remove('is-celebrating');
  }, 2400);
}

function updateQuestChrome() {
  const total = allQuestions().length;
  const answered = answeredQuestions().length;
  const requiredIds = requiredQuestionSet();
  const requiredAnswered = allQuestions().filter((question) => requiredIds.has(question.id) && answerExists(question)).length;
  const percent = total ? Math.round(answered / total * 100) : 0;
  $('#xp-count').textContent = `${currentXP()} XP`;
  $('#answer-count').textContent = `${answered} answered`;
  $('#badge-count').textContent = `${completedStages()} badges`;
  $('#overall-label').textContent = `${answered} of ${total} activity notes`;
  $('#overall-percent').textContent = `${percent}%`;
  $('#overall-progress-fill').style.width = `${percent}%`;
  let policy = $('#mandatory-question-policy');
  if (!policy) {
    policy = document.createElement('div');
    policy.id = 'mandatory-question-policy';
    policy.className = 'mandatory-question-policy';
    $('.score-rules')?.before(policy);
  }
  if (policy) policy.innerHTML = `<strong>${requiredAnswered} / ${requiredIds.size} required answers complete</strong><span>${requiredIds.size} of ${total} questions are required (at least 85%). Required questions are marked; the rest are optional.</span>`;
  const sectionRequirement = $('#section-required-progress');
  if (sectionRequirement) {
    const stage = activeQuestionnaire().stages[activeStage];
    const stageRequired = stage.questions.filter((question) => isRequiredQuestion(question));
    const done = stageRequired.filter(answerExists).length;
    sectionRequirement.innerHTML = `<strong>${done} of ${stageRequired.length} required answers complete</strong><span>Answer the required questions in this section to continue. Optional questions can be skipped.</span>`;
  }
  if (activeTrack === 'school') {
    $('#score-rules-copy').textContent = selectedSchoolLevel === 'junior'
      ? '15 star points per answer · +30 for a complete mini quest · +50 grand-finale bonus'
      : '10 per answer · +25 for a full section · +50 finish bonus when you add an answer';
  }
  stagePanel.querySelectorAll('.stage-count-badge').forEach((badge) => {
    const stage = activeQuestionnaire().stages[activeStage];
    badge.textContent = `${stage.questions.filter(answerExists).length} / ${stage.questions.length} answered`;
  });
  stagePanel.querySelectorAll('.answer-option').forEach((button) => {
    const value = answers[button.dataset.question];
    const selected = Array.isArray(value) ? value.includes(button.dataset.value) : value === button.dataset.value;
    button.setAttribute('aria-pressed', String(selected));
  });
}

function startQuest() {
  const countryChoice = $('#emissions-country').value;
  if (!GRID_FACTORS[countryChoice]) {
    $('#emissions-country').focus();
    showToast('Choose your country before starting the quest.');
    return;
  }
  participantEmail = '';
  participantName = '';
  participantAge = '';
  participantCity = '';
  selectedCountry = countryChoice;
  activeTrack = selectedTrack;
  activeStage = 0;
  answers = {};
  if (activeTrack === 'school' && selectedSchoolLevel === 'junior') answers.school_days = '5';
  stageScores = {};
  lastScore = null;
  submissionStarted = false;
  $('#results').hidden = true;
  questSection.hidden = false;
  renderStage();
  questSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

$('#start-button').addEventListener('click', startQuest);
$('.header-cta').addEventListener('click', (event) => {
  event.preventDefault();
  startQuest();
});

stagePanel.addEventListener('click', (event) => {
  const dismiss = event.target.closest('[data-dismiss-score]');
  if (dismiss) {
    lastScore = null;
    renderStage();
    return;
  }
  const button = event.target.closest('[data-action="answer"]');
  if (!button) return;
  const question = allQuestions().find((item) => item.id === button.dataset.question);
  if (!question) return;
  const value = button.dataset.value;
  if (question.type === 'multi') {
    const selected = new Set(Array.isArray(answers[question.id]) ? answers[question.id] : []);
    if (question.exclusive?.includes(value)) {
      if (selected.has(value)) selected.delete(value);
      else {
        selected.clear();
        selected.add(value);
      }
    } else {
      question.exclusive?.forEach((exclusive) => selected.delete(exclusive));
      if (selected.has(value)) selected.delete(value);
      else selected.add(value);
    }
    if (selected.size) answers[question.id] = [...selected];
    else delete answers[question.id];
  } else if (answers[question.id] === value) {
    delete answers[question.id];
  } else {
    answers[question.id] = value;
  }
  delete stageScores[activeStage];
  updateQuestChrome();
});

stagePanel.addEventListener('input', (event) => {
  const nameInput = event.target.closest('#participant-name');
  if (nameInput) {
    participantName = nameInput.value;
    return;
  }
  const ageInput = event.target.closest('#participant-age');
  if (ageInput) {
    participantAge = ageInput.value;
    return;
  }
  const cityInput = event.target.closest('#participant-city');
  if (cityInput) {
    participantCity = cityInput.value;
    return;
  }
  const emailInput = event.target.closest('#participant-email');
  if (emailInput) {
    participantEmail = emailInput.value;
    return;
  }
  const input = event.target.closest('[data-action="number"], [data-action="range"]');
  if (!input) return;
  const question = allQuestions().find((item) => item.id === input.dataset.question);
  if (!question) return;
  const numberInput = document.getElementById(`answer-${question.id}`);
  const rangeInput = document.getElementById(`slider-${question.id}`);
  const rangeOutput = document.getElementById(`range-value-${question.id}`);
  if (input.dataset.action === 'range') {
    numberInput.value = rangeInput.value;
  } else {
    const numberValue = input.value === '' ? NaN : Number(input.value);
    rangeInput.value = Number.isFinite(numberValue) ? Math.min(numberValue, Number(rangeInput.max)) : 0;
  }
  const displayValue = numberInput.value === ''
    ? 'Choose a value or type one'
    : `${numberInput.value}${question.unit ? ` ${question.unit}` : ''}`;
  rangeOutput.textContent = displayValue;
  rangeInput.setAttribute('aria-valuetext', `${rangeInput.value}${question.unit ? ` ${question.unit}` : ''}`);
  delete stageScores[activeStage];
  if (numberInput.value === '') delete answers[question.id];
  else answers[question.id] = numberInput.value;
  updateQuestChrome();
});

$('#previous-stage').addEventListener('click', () => {
  if (activeStage === 0) return;
  activeStage -= 1;
  lastScore = null;
  renderStage();
});

$('#next-stage').addEventListener('click', () => {
  const stages = activeQuestionnaire().stages;
  const stage = stages[activeStage];
  const isFinalStage = activeStage === stages.length - 1;
  const missingRequired = stage.questions.filter((question) => isRequiredQuestion(question) && !answerExists(question));
  if (missingRequired.length) {
    const question = missingRequired[0];
    if (question.type === 'number') {
      const input = document.getElementById(`answer-${question.id}`);
      input?.focus();
      input?.reportValidity();
    } else {
      [...stagePanel.querySelectorAll('.answer-option')].find((option) => option.dataset.question === question.id)?.focus();
    }
    showToast(`Answer the ${missingRequired.length} required question${missingRequired.length === 1 ? '' : 's'} in this section before continuing.`);
    return;
  }
  const invalidNumber = stage.questions.find((question) => question.type === 'number' && answerExists(question) && !document.getElementById(`answer-${question.id}`).checkValidity());
  if (invalidNumber) {
    const input = document.getElementById(`answer-${invalidNumber.id}`);
    input.focus();
    input.reportValidity();
    return;
  }
  if (isFinalStage) {
    const nameInput = $('#participant-name');
    const ageInput = $('#participant-age');
    const cityInput = $('#participant-city');
    const emailInput = $('#participant-email');
    nameInput.value = nameInput.value.trim();
    ageInput.value = ageInput.value.trim();
    if (cityInput) cityInput.value = cityInput.value.trim();
    emailInput.value = emailInput.value.trim();
    if (nameInput.value.length > 120 || !ageInput.checkValidity()) {
      const invalidInput = nameInput.value.length > 120 ? nameInput : ageInput;
      invalidInput.focus();
      invalidInput.reportValidity();
      return;
    }
    if (!emailInput.value || !emailInput.checkValidity()) {
      emailInput.focus();
      emailInput.reportValidity();
      showToast('Enter a valid email address to unlock your PDF download.');
      return;
    }
    participantName = nameInput.value;
    participantAge = ageInput.value;
    participantCity = cityInput ? cityInput.value : '';
    participantEmail = emailInput.value;
  }
  const answered = stage.questions.filter(answerExists).length;
  const total = stage.questions.length;
  const badgeEarned = stage.questions.filter((question) => isRequiredQuestion(question)).every(answerExists);
  const junior = activeTrack === 'school' && selectedSchoolLevel === 'junior';
  const points = answered * (junior ? 15 : 10) + (badgeEarned ? (junior ? 30 : 25) : 0);
  stageScores[activeStage] = points;
  if (isFinalStage) {
    const emissions = calculateEmissions();
    lastScore = { title: stage.title, answered, total, points, badge: stage.badge, badgeEarned, nextIndex: activeStage + 1, totalXP: currentXP(), tier: emissions.tier };
    showSectionCelebration(lastScore);
    showResults();
    return;
  }
  activeStage += 1;
  lastScore = { title: stage.title, answered, total, points, badge: stage.badge, badgeEarned, nextIndex: activeStage, totalXP: currentXP() };
  renderStage();
  showSectionCelebration(lastScore);
  stagePanel.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

function answerText(question) {
  const value = answers[question.id];
  if (Array.isArray(value)) return value.join(', ');
  if (question.type === 'number') return `${value}${question.unit ? ` ${question.unit}` : ''}`;
  return String(value);
}

function renderSummary() {
  const summary = $('#answer-summary');
  const groups = activeQuestionnaire().stages.map((stage) => {
    const rows = stage.questions.filter(answerExists);
    if (!rows.length) return '';
    const entries = rows.map((question) => `<li><strong>${escapeHtml(question.label)}</strong> ${escapeHtml(answerText(question))}</li>`).join('');
    return `<div class="summary-group"><h4>${escapeHtml(stage.title)}</h4><ul class="summary-list">${entries}</ul></div>`;
  }).filter(Boolean);
  summary.innerHTML = groups.join('');
  $('#snapshot-empty').hidden = answeredQuestions().length > 0;
}

function getSuggestions() {
  const suggestions = [];
  const get = (key) => answers[key];
  const commute = get(activeTrack === 'school' ? 'school_mode' : activeTrack === 'college' ? 'college_mode' : activeTrack === 'employee' ? 'employee_mode' : 'individual_mode');
  if (['Family car', 'Two-wheeler', 'Car', 'Taxi or ride-hail'].includes(commute)) {
    suggestions.push('For a route where it is safe and practical, compare a shared ride or public transport option for one trip.');
  } else if (['Bicycle', 'Walk', 'Walk or bicycle'].includes(commute)) {
    suggestions.push('You already walk or cycle for your usual trip. Could a friend join you for one more short journey?');
  } else {
    suggestions.push('Pick one regular journey and compare the available ways to make it: shared ride, bus, public transport, walking, or cycling.');
  }

  const switchOff = get(activeTrack === 'school' ? 'switch_off' : activeTrack === 'employee' ? 'device_powerdown' : undefined);
  const solar = get(activeTrack === 'school' ? 'home_solar' : activeTrack === 'college' ? 'college_solar' : activeTrack === 'employee' ? 'office_renewable' : 'individual_solar');
  if (['Sometimes', 'Rarely', 'No'].includes(switchOff)) {
    suggestions.push('Try a simple end-of-study check: switch off lights, fans, and screens when you leave.');
  } else if (solar === 'No') {
    suggestions.push('If you can, ask whether your home or residence has a renewable electricity option.');
  } else {
    suggestions.push('Notice one energy habit this week—like screen time or cooling—and see whether a small change feels comfortable.');
  }

  const leftovers = get(activeTrack === 'school' ? 'food_leftovers' : activeTrack === 'employee' ? 'work_food_waste' : undefined);
  const waste = get(activeTrack === 'school' ? 'food_waste_method' : undefined);
  const compost = get('compost');
  if (['A few times a week', 'Most days', 'Most workdays'].includes(leftovers)) {
    suggestions.push('If portions are flexible, try serving a little less first and saving seconds for later.');
  } else if (waste === 'Put in mixed rubbish' || compost === 'No') {
    suggestions.push(activeTrack === 'employee' ? 'Ask whether your workplace can offer food-scrap collection or clearer waste sorting.' : 'Find out whether your school or residence has a food-scrap or compost collection option.');
  } else if (get('reusables') === 'Neither right now' || get('work_reusables') === 'Not right now') {
    suggestions.push('A reusable bottle or lunch box can be an easy swap if it fits your routine and budget.');
  } else if (activeTrack === 'employee' && get('employer_climate_plan') === 'No') {
    suggestions.push('Ask your workplace what climate data it already tracks and where a practical first step might fit.');
  } else {
    suggestions.push('Keep food in the picture: planning a meal or using leftovers can help avoid edible food going to waste.');
  }
  return [...new Set(suggestions)].slice(0, 3);
}

function numericAnswer(id) {
  if (!answerExists({ id })) return null;
  const value = Number(answers[id]);
  return Number.isFinite(value) && value >= 0 ? value : null;
}

function getCountryFactor() {
  return GRID_FACTORS[selectedCountry] || GRID_FACTORS.global;
}

function commuteEstimate() {
  const options = {
    school: { mode: 'school_mode', distance: 'school_distance', days: 'school_days', weeks: 40, occupancy: 'school_carpool' },
    college: { mode: 'college_mode', distance: 'college_distance', days: 'college_days', weeks: 48, occupancy: 'ride_share' },
    employee: { mode: 'employee_mode', distance: 'employee_distance', days: 'workplace_days', weeks: 48, occupancy: 'employee_carpool' },
    individual: { mode: 'individual_mode', distance: 'individual_distance', days: 'individual_days', weeks: 48, occupancy: 'individual_carpool' }
  }[activeTrack];
  const mode = answers[options.mode];
  if (!mode) return { kg: null, reason: 'Commute mode was not provided.' };
  if (['Bicycle', 'Walk', 'Walk or bicycle'].includes(mode)) {
    return { kg: 0, reason: 'Walking or cycling selected; direct commute emissions are treated as zero.' };
  }
  if (mode === 'Mostly work from home') return { kg: 0, reason: 'Mostly working from home selected; commute emissions are treated as zero.' };
  const distance = numericAnswer(options.distance);
  const days = numericAnswer(options.days);
  if (distance === null || days === null) return { kg: null, reason: 'Add one-way distance and travel days per week to estimate the commute.' };
  const annualPassengerKm = distance * 2 * days * options.weeks;
  let factor;
  let occupancy = 1;
  let modeLabel = mode;
  if (mode === 'School bus' || mode === 'College or shuttle bus' || mode === 'Public transport') {
    factor = TRAVEL_FACTORS.bus;
    modeLabel = mode === 'Public transport' ? 'public transport (bus proxy)' : mode;
  } else if (mode === 'Family car' || mode === 'Car') {
    factor = TRAVEL_FACTORS.car;
    const ride = answers[options.occupancy];
    if (activeTrack === 'school') {
      occupancy = { Usually: 3, Sometimes: 2, 'Not usually': 2 }[ride];
    } else {
      occupancy = { 'Just me': 1, '2 people total': 2, '3 or more people': 3 }[ride];
    }
    if (!occupancy) return { kg: null, reason: 'Add the car-sharing answer so vehicle emissions can be divided among occupants.' };
    modeLabel = `car, assumed ${occupancy} occupant${occupancy === 1 ? '' : 's'}`;
  } else if (mode === 'Two-wheeler') {
    factor = TRAVEL_FACTORS.motorbike;
  } else if (mode === 'Taxi or ride-hail') {
    factor = TRAVEL_FACTORS.taxi;
  } else if (mode === 'Other') {
    return { kg: null, reason: 'The selected travel mode needs a matching emission factor.' };
  } else {
    return { kg: null, reason: 'The selected travel mode needs a matching emission factor.' };
  }
  return {
    kg: annualPassengerKm * factor / occupancy,
    reason: `${modeLabel}; ${options.weeks} active weeks per year${activeTrack === 'school' && selectedSchoolLevel === 'junior' ? ' and 5 school days per week assumed' : ''}. UK 2026 travel factors used as reference proxies.`
  };
}

function electricityEstimate() {
  const grid = getCountryFactor();
  if (activeTrack === 'school') {
    const monthly = numericAnswer('school_monthly_kwh');
    const people = numericAnswer('school_household_size');
    if (monthly === null) return { kg: null, reason: 'No exact monthly electricity amount was entered.' };
    if (!people || people < 1) return { kg: null, reason: 'Add the number of people sharing the household electricity use.' };
    return {
      kg: monthly * 12 / people * grid.kgPerKwh,
      reason: `Household kWh divided by ${people} people, annualized, then multiplied by the ${grid.name} ${grid.year} grid factor.`
    };
  }
  if (activeTrack === 'individual') {
    const monthly = numericAnswer('individual_monthly_kwh');
    const people = numericAnswer('individual_household_size');
    if (monthly === null) return { kg: null, reason: 'No exact monthly electricity amount was entered.' };
    if (!people || people < 1) return { kg: null, reason: 'Add the number of people sharing the household electricity use.' };
    return {
      kg: monthly * 12 / people * grid.kgPerKwh,
      reason: `Household kWh divided by ${people} people, annualized, then multiplied by the ${grid.name} ${grid.year} grid factor.`
    };
  }
  if (activeTrack === 'college') {
    const monthly = numericAnswer('monthly_kwh');
    if (monthly === null) return { kg: null, reason: 'No monthly electricity amount was entered.' };
    const people = numericAnswer('bill_sharers');
    const divisor = people && people >= 1 ? people : 1;
    const sharingNote = divisor > 1 ? `divided among ${divisor} bill sharers` : 'treated as personal use because no bill-sharing count was entered';
    return {
      kg: monthly * 12 / divisor * grid.kgPerKwh,
      reason: `Monthly kWh ${sharingNote}, annualized, then multiplied by the ${grid.name} ${grid.year} grid factor.`
    };
  }
  return { kg: null, reason: 'No personal or allocated workplace electricity kWh was provided.' };
}

function calculateEmissions() {
  const grid = getCountryFactor();
  const stages = activeQuestionnaire().stages;
  const sections = stages.map((stage, index) => ({
    title: stage.title,
    kg: null,
    reason: 'The answers in this section do not include enough measured activity for a defensible estimate.'
  }));
  sections[0] = { title: stages[0].title, ...commuteEstimate() };
  if (activeTrack !== 'employee') sections[1] = { title: stages[1].title, ...electricityEstimate() };
  if (activeTrack === 'college' && (answerExists({ id: 'domestic_flights' }) || answerExists({ id: 'international_flights' }))) {
    sections[0].reason += ' Flight counts are not included because route distances were not collected.';
  }
  if (activeTrack === 'employee' && answers.work_flights && answers.work_flights !== 'Never') {
    sections[0].reason += ' Flight frequency is not included because route distances were not collected.';
  }
  if (activeTrack === 'college' && answers.taxi_frequency && answers.taxi_frequency !== 'Never') {
    sections[0].reason += ' Taxi frequency is not included because trip distances were not collected.';
  }
  const measured = sections.filter((section) => Number.isFinite(section.kg));
  const totalKg = measured.length ? measured.reduce((sum, section) => sum + section.kg, 0) : null;
  let tier = null;
  if (totalKg !== null) {
    tier = totalKg <= 500 ? 'Platinum' : totalKg <= 1500 ? 'Gold' : totalKg <= 3000 ? 'Silver' : 'Bronze';
  }
  return {
    country: { key: selectedCountry, name: grid.name, gridKgPerKwh: grid.kgPerKwh, gridGPerKwh: grid.gPerKwh, datasetYear: grid.year },
    totalKg,
    tier,
    coverage: { estimatedSections: measured.length, totalSections: sections.length },
    sections,
    methodology: {
      travelWeeksPerYear: activeTrack === 'school' ? 40 : 48,
      travelFactors: 'UK DESNZ 2026 factors used as educational reference proxies',
      electricityFactors: '2025 grid-intensity factors from Ember 2026 release; Europe uses the EU-wide average',
      tierNote: 'Gamified tier based only on the tracked subtotal; not a certification or full personal footprint.'
    }
  };
}

function formatKg(value) {
  return new Intl.NumberFormat('en', { maximumFractionDigits: 1 }).format(value);
}

function renderCarbonResults() {
  const emissions = calculateEmissions();
  $('#carbon-total').textContent = emissions.totalKg === null ? 'No quantified emissions yet' : `${formatKg(emissions.totalKg)} kg CO2e/year`;
  $('#carbon-coverage').textContent = `${emissions.coverage.estimatedSections} of ${emissions.coverage.totalSections} sections estimated. This is a partial activity subtotal, not a full carbon footprint.`;
  const countryLabel = emissions.country.key === 'europe' ? 'Europe (EU-wide average)' : emissions.country.name;
  $('#carbon-country').textContent = `Electricity grid proxy: ${countryLabel} · ${emissions.country.gridGPerKwh} g CO2e/kWh (${emissions.country.datasetYear}).`;
  $('#carbon-tier-name').textContent = emissions.tier || 'Activity Explorer';
  const tierElement = $('#carbon-tier');
  tierElement.className = `carbon-tier${emissions.tier ? ` carbon-tier-${emissions.tier.toLowerCase()}` : ''}`;
  tierElement.querySelector('.carbon-tier-medal').textContent = emissions.tier ? '✦' : '✧';
  $('#carbon-section-list').innerHTML = emissions.sections.map((section) => {
    const amount = Number.isFinite(section.kg) ? `${formatKg(section.kg)} kg CO2e/year` : 'Not estimated';
    return `<div class="carbon-section-row"><strong>${escapeHtml(section.title)}</strong><span>${escapeHtml(amount)}</span><small>${escapeHtml(section.reason)}</small></div>`;
  }).join('');
  return emissions;
}

function showResults() {
  renderSummary();
  renderCarbonResults();
  $('#result-track').textContent = `${pathDisplayLabel().toUpperCase()} PATH`;
  const hasActivityAnswers = answeredQuestions().length > 0;
  $('#result-xp').textContent = hasActivityAnswers
    ? `You earned ${currentXP() + 50} XP, including your quest-complete bonus.`
    : 'Your field guide is ready. Add answers next time to earn quest XP.';
  const titles = {
    school: 'Everyday Climate Explorer',
    college: 'Carbon Accounting Explorer',
    employee: 'Workplace Climate Explorer',
    individual: 'Personal Climate Explorer'
  };
  $('#result-badge-title').textContent = activeTrack === 'school' && selectedSchoolLevel === 'junior' ? 'Junior Planet Explorer' : titles[activeTrack];
  $('#next-steps').innerHTML = getSuggestions().map((suggestion) => `<li>${escapeHtml(suggestion)}</li>`).join('');
  const earned = activeQuestionnaire().stages.filter((stage, index) => stageScores[index] !== undefined && stage.questions.filter((question) => isRequiredQuestion(question)).every(answerExists)).map((stage) => stage.badge);
  $('#earned-badges').innerHTML = earned.length
    ? earned.map((badge, index) => `<span class="earned-badge" style="--badge-index:${index}"><span>✳</span>${escapeHtml(badge)}</span>`).join('')
    : '<span class="earned-badge"><span>✧</span>Curiosity Starter</span>';
  questSection.hidden = true;
  resultsSection.hidden = false;
  if (!submissionStarted) {
    submissionStarted = true;
    void submitActivitySnapshot();
  }
  resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function resetQuest() {
  answers = {};
  participantEmail = '';
  participantName = '';
  participantAge = '';
  participantCity = '';
  if (activeTrack === 'school' && selectedSchoolLevel === 'junior') answers.school_days = '5';
  stageScores = {};
  activeStage = 0;
  lastScore = null;
  submissionStarted = false;
  $('#drive-save-status').className = 'drive-save-status';
  $('#drive-save-status').hidden = false;
  $('#drive-save-status').textContent = 'Ready for another quest.';
  resultsSection.hidden = true;
  questSection.hidden = false;
  renderStage();
  questSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

$('#reset-button').addEventListener('click', resetQuest);
$('#retake-button').addEventListener('click', resetQuest);

function buildSubmissionData() {
  const emissions = calculateEmissions();
  const suggestions = getSuggestions();
  const trackKey = activeTrack === 'school'
    ? (selectedSchoolLevel === 'junior' ? 'junior' : 'senior')
    : activeTrack;
  const totalKg = emissions.totalKg;
  const annualKg = totalKg !== null ? Math.round(totalKg * 100) / 100 : null;
  const monthlyKg = totalKg !== null ? Math.round((totalKg / 12) * 100) / 100 : null;
  const greenPoints = currentXP() + (answeredQuestions().length > 0 ? 50 : 0);

  return {
    submissionId: (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : ('sub_' + Date.now()),
    questionnaire: 'GreenerQuest',
    trackKey,
    studentPath: pathDisplayLabel(),
    pathLabel: pathDisplayLabel(),
    schoolLevel: activeTrack === 'school' ? (selectedSchoolLevel === 'junior' ? 'Junior' : 'Senior') : undefined,
    name: participantName.trim(),
    age: participantAge === '' ? '' : Number(participantAge),
    city: participantCity.trim(),
    email: participantEmail.trim(),
    category: emissions.tier || pathDisplayLabel(),
    submittedAt: new Date().toISOString(),
    score: {
      xp: greenPoints,
      fieldBadges: activeQuestionnaire().stages.filter((stage, index) => stageScores[index] !== undefined && stage.questions.filter((question) => isRequiredQuestion(question)).every(answerExists)).map((stage) => stage.badge)
    },
    greenPoints,
    country: emissions.country,
    emissions,
    annualKg,
    monthlyKg,
    suggestions,
    note: 'Emissions are a partial tracked activity subtotal. Unmeasured sections are not zero; the tier is gamified and is not a certification.',
    responses: allQuestions().filter(answerExists).map((question) => ({
      category: question.stageTitle,
      question: question.label,
      answer: answers[question.id],
      unit: question.type === 'number' ? question.unit : undefined
    }))
  };
}

function pdfAscii(value) {
  return String(value)
    .replace(/CO₂e/g, 'CO2e')
    .replace(/×/g, 'x')
    .replace(/[–—]/g, '-')
    .replace(/[·•]/g, '-')
    .replace(/[“”]/g, '"')
    .replace(/[’‘]/g, "'")
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\x20-\x7E]/g, '');
}

function pdfEscape(value) {
  return pdfAscii(value).replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
}

function wrapPdfText(text, maxLength = 86) {
  const words = pdfAscii(text).split(/\s+/);
  const rows = [];
  let row = '';
  words.forEach((word) => {
    if (row && `${row} ${word}`.length > maxLength) {
      rows.push(row);
      row = word;
    } else {
      row = row ? `${row} ${word}` : word;
    }
  });
  if (row) rows.push(row);
  return rows.length ? rows : [''];
}

function buildReportBlocks(data) {
  const emissions = data.emissions;
  const badgeTitles = {
    School: 'Everyday Climate Explorer',
    'Junior School': 'Junior Planet Explorer',
    'Senior School': 'Everyday Climate Explorer',
    College: 'Carbon Accounting Explorer',
    Employee: 'Workplace Climate Explorer',
    Individual: 'Personal Climate Explorer'
  };
  const hasAnswers = data.responses.length > 0;
  const xpSummary = hasAnswers
    ? `You earned ${data.score.xp} XP, including your quest-complete bonus.`
    : 'Your field guide is ready. Add answers next time to earn quest XP.';
  const totalSummary = emissions.totalKg === null
    ? 'No quantified emissions yet'
    : `${formatKg(emissions.totalKg)} kg CO2e/year`;
  const groups = [];
  data.responses.forEach((response) => {
    let group = groups.find((item) => item.category === response.category);
    if (!group) {
      group = { category: response.category, responses: [] };
      groups.push(group);
    }
    group.responses.push(response);
  });

  const blocks = [
    { kind: 'title', text: 'Your climate field guide.' },
    { kind: 'body', text: 'You made time to notice your everyday patterns. That is a meaningful first step.' },
    { kind: 'award-card', title: data.schoolLevel === 'Junior' ? 'Junior Planet Explorer' : badgeTitles[data.studentPath] || 'Climate Explorer', subtitle: xpSummary },
    { kind: 'heading', text: 'Tracked annual emissions subtotal' },
    {
      kind: 'emissions-card',
      total: totalSummary,
      lines: [
        `${emissions.coverage.estimatedSections} of ${emissions.coverage.totalSections} sections estimated. This is a partial activity subtotal, not a full carbon footprint.`,
        `Electricity grid proxy: ${emissions.country.name} - ${emissions.country.gridGPerKwh} g CO2e/kWh (${emissions.country.datasetYear}).`,
        `GreenerQuest tier: ${emissions.tier || 'Activity Explorer'}`
      ]
    },
    { kind: 'subheading', text: 'Section emissions' },
    ...emissions.sections.flatMap((section) => [
      { kind: 'section', text: `${section.title}: ${Number.isFinite(section.kg) ? `${formatKg(section.kg)} kg CO2e/year` : 'Not estimated'}` },
      { kind: 'small', text: section.reason }
    ]),
    { kind: 'heading', text: 'Field badges' },
    { kind: 'badge-list', text: data.score.fieldBadges.length ? data.score.fieldBadges.join('  |  ') : 'Curiosity Starter' },
    { kind: 'heading', text: 'Your activity snapshot' }
  ];

  if (data.name) blocks.splice(2, 0, { kind: 'small', text: `Name: ${data.name}` });
  let participantOffset = data.name ? 3 : 2;
  if (data.age !== '' && data.age !== null && data.age !== undefined) {
    blocks.splice(participantOffset, 0, { kind: 'small', text: `Age: ${data.age}` });
    participantOffset++;
  }
  if (data.city) {
    blocks.splice(participantOffset, 0, { kind: 'small', text: `City: ${data.city}` });
  }

  if (!groups.length) {
    blocks.push({ kind: 'body', text: 'No answers were added this time. You can still take another pass whenever you are ready.' });
  } else {
    groups.forEach((group) => {
      blocks.push({ kind: 'subheading', text: group.category });
      group.responses.forEach((response) => {
        const answer = Array.isArray(response.answer) ? response.answer.join(', ') : String(response.answer);
        blocks.push({ kind: 'answer', text: `${response.question}: ${answer}${response.unit ? ` ${response.unit}` : ''}` });
      });
    });
  }

  blocks.push({
    kind: 'next-steps',
    items: getSuggestions(),
    note: 'Pick one that works for your life. Small and repeatable beats perfect.'
  });
  blocks.push({
    kind: 'method-section',
    title: 'How this report gets its numbers',
    paragraphs: [
      { kind: 'body', text: 'Emissions = activity data x emission factor. This is a partial subtotal: it estimates commuting and electricity when enough details are available. Travel uses UK 2026 factors as educational proxies; electricity uses a 2025 grid factor for your chosen location. Europe uses the EU-wide generation average. Missing sections are "not estimated," not zero. Platinum, gold, silver, and bronze are playful tiers for this subtotal, not certifications.' },
      { kind: 'small', text: `Electricity factor: ${emissions.country.gridGPerKwh} g CO2e/kWh for ${emissions.country.name}${emissions.country.key === 'europe' ? ' (EU-wide average)' : ''} (${emissions.country.datasetYear} generation intensity).` },
      { kind: 'small', text: 'Travel factors: UK DESNZ 2026 reference factors for average car, local bus, motorbike, and taxi. Commute distance is round trip and annualized for 40 school weeks or 48 college, work, or individual weeks. Public transport uses a bus proxy; car emissions are divided by the reported occupant count.' },
      { kind: 'small', text: 'Only sections with measurable activity and a factor contribute. Unmeasured food, purchasing, waste, flight routes, and workplace energy are not treated as zero.' },
      { kind: 'source', text: 'Sources: Ember, Global Electricity Review 2026 and European Electricity Review 2026; UK DESNZ, Greenhouse Gas Conversion Factors 2026.' },
      { kind: 'small', text: `Created ${new Date(data.submittedAt).toLocaleString('en', { dateStyle: 'medium', timeStyle: 'short' })}.` }
    ]
  });
  return blocks;
}

function createReportPdf(data) {
  const pages = [[]];
  let y = 704;
  const addPage = () => { pages.push([]); y = 720; };
  buildReportBlocks(data).forEach((block) => {
    if (block.kind === 'award-card') {
      const titleLines = wrapPdfText(block.title, 70);
      const subtitleLines = wrapPdfText(block.subtitle, 82);
      const height = 24 + titleLines.length * 16 + subtitleLines.length * 12;
      if (y - height < 58) addPage();
      pages[pages.length - 1].push({ type: 'award-card', top: y, height, titleLines, subtitleLines });
      y -= height + 10;
      return;
    }
    if (block.kind === 'emissions-card') {
      const lines = [block.total, ...block.lines].flatMap((line) => wrapPdfText(line, 84));
      const height = 23 + lines.length * 12;
      if (y - height < 58) addPage();
      pages[pages.length - 1].push({ type: 'emissions-card', top: y, height, lines });
      y -= height + 11;
      return;
    }
    if (block.kind === 'next-steps') {
      const items = block.items.flatMap((item) => wrapPdfText(item, 82).map((line, lineIndex) => ({
        text: `${lineIndex === 0 ? '- ' : '  '}${line}`
      })));
      const noteLines = wrapPdfText(block.note, 86);
      const height = 24 + items.length * 12 + noteLines.length * 11 + 8;
      if (y - height < 58) addPage();
      pages[pages.length - 1].push({ type: 'next-steps', top: y, height, items, noteLines });
      y -= height + 11;
      return;
    }
    if (block.kind === 'method-section') {
      const lines = [{ text: block.title, kind: 'heading', font: 'F2', fontSize: 12, step: 19, gap: 5 }];
      block.paragraphs.forEach((paragraph) => {
        const isSmall = paragraph.kind === 'small' || paragraph.kind === 'source';
        wrapPdfText(paragraph.text, 88).forEach((line) => lines.push({
          text: line,
          kind: paragraph.kind,
          font: 'F1',
          fontSize: isSmall ? 8 : 9,
          step: isSmall ? 11 : 13,
          gap: 0
        }));
        lines[lines.length - 1].gap = 3;
      });
      const height = lines.reduce((total, line) => total + line.step + line.gap, 8);
      if (y - height < 58) addPage();
      pages[pages.length - 1].push({ type: 'method-section', top: y, height, lines });
      y -= height + 10;
      return;
    }

    const isHeading = block.kind === 'heading';
    const fontSize = block.kind === 'title' ? 22 : isHeading ? 12 : block.kind === 'subheading' ? 10 : block.kind === 'small' || block.kind === 'source' ? 8 : block.kind === 'section' ? 9.5 : 9;
    const font = ['title', 'heading', 'subheading', 'section', 'badge-list'].includes(block.kind) ? 'F2' : 'F1';
    const step = block.kind === 'title' ? 28 : isHeading ? 19 : block.kind === 'subheading' ? 16 : block.kind === 'small' || block.kind === 'source' ? 11 : block.kind === 'answer' ? 12 : 13;
    if (isHeading) y -= 4;
    const rows = wrapPdfText(block.text, block.kind === 'title' ? 48 : isHeading ? 75 : 88);
    rows.forEach((row) => {
      if (y - step < 58) addPage();
      pages[pages.length - 1].push({ type: 'text', text: row, y, font, fontSize, kind: block.kind });
      y -= step;
    });
    if (['body', 'source', 'badge-list'].includes(block.kind)) y -= 3;
  });

  const objects = [];
  const put = (value) => { objects.push(value); return objects.length; };
  const catalogId = put('');
  const pagesId = put('');
  const regularFontId = put('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');
  const boldFontId = put('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>');
  const pageIds = [];
  pages.forEach((rows, index) => {
    const commands = [
      '0.91 0.94 0.88 rg 0 742 595 100 re f',
      '0.12 0.23 0.18 rg',
      'BT /F2 18 Tf 1 0 0 1 48 795 Tm (GreenerQuest) Tj ET',
      `BT /F1 10 Tf 1 0 0 1 48 775 Tm (${pdfEscape(`${(data.pathLabel || data.studentPath).toUpperCase()} PATH - CLIMATE FIELD GUIDE`)}) Tj ET`,
      `BT /F1 8 Tf 1 0 0 1 485 775 Tm (Page ${index + 1} of ${pages.length}) Tj ET`
    ];
    rows.forEach((row) => {
      if (row.type === 'award-card') {
        const bottom = row.top - row.height;
        commands.push(`0.10 0.25 0.18 rg 40 ${bottom} 515 ${row.height} re f`);
        commands.push(`0.85 0.65 0.36 rg 40 ${bottom} 4 ${row.height} re f`);
        let textY = row.top - 14;
        commands.push(`0.85 0.90 0.68 rg BT /F2 8 Tf 1 0 0 1 56 ${textY} Tm (QUEST BADGE UNLOCKED) Tj ET`);
        textY -= 17;
        row.titleLines.forEach((line) => {
          commands.push(`1 1 1 rg BT /F2 13 Tf 1 0 0 1 56 ${textY} Tm (${pdfEscape(line)}) Tj ET`);
          textY -= 15;
        });
        row.subtitleLines.forEach((line) => {
          commands.push(`0.85 0.91 0.86 rg BT /F1 8 Tf 1 0 0 1 56 ${textY} Tm (${pdfEscape(line)}) Tj ET`);
          textY -= 11;
        });
        return;
      }
      if (row.type === 'emissions-card') {
        const bottom = row.top - row.height;
        commands.push(`0.10 0.25 0.18 rg 40 ${bottom} 515 ${row.height} re f`);
        commands.push(`0.66 0.77 0.48 rg 40 ${bottom} 4 ${row.height} re f`);
        let textY = row.top - 14;
        row.lines.forEach((line, lineIndex) => {
          const isTotal = lineIndex === 0;
          const color = isTotal ? '0.95 0.78 0.43' : '0.91 0.95 0.90';
          const font = isTotal ? 'F2' : 'F1';
          const size = isTotal ? 14 : 8;
          commands.push(`${color} rg BT /${font} ${size} Tf 1 0 0 1 56 ${textY} Tm (${pdfEscape(line)}) Tj ET`);
          textY -= isTotal ? 16 : 11;
        });
        return;
      }
      if (row.type === 'next-steps') {
        const bottom = row.top - row.height;
        commands.push(`0.94 0.96 0.90 rg 40 ${bottom} 515 ${row.height} re f`);
        commands.push(`0.85 0.65 0.36 rg 40 ${bottom} 4 ${row.height} re f`);
        let textY = row.top - 16;
        commands.push(`0.13 0.27 0.20 rg BT /F2 11 Tf 1 0 0 1 56 ${textY} Tm (One small next step) Tj ET`);
        textY -= 17;
        row.items.forEach((item) => {
          commands.push(`0.17 0.24 0.20 rg BT /F1 8 Tf 1 0 0 1 56 ${textY} Tm (${pdfEscape(item.text)}) Tj ET`);
          textY -= 11;
        });
        row.noteLines.forEach((line) => {
          commands.push(`0.45 0.34 0.18 rg BT /F2 8 Tf 1 0 0 1 56 ${textY} Tm (${pdfEscape(line)}) Tj ET`);
          textY -= 10;
        });
        return;
      }
      if (row.type === 'method-section') {
        let textY = row.top;
        row.lines.forEach((line) => {
          textY -= line.step;
          const colors = {
            heading: '0.13 0.27 0.20',
            body: '0.17 0.24 0.20',
            small: '0.43 0.49 0.44',
            source: '0.43 0.49 0.44'
          };
          commands.push(`${colors[line.kind] || '0.17 0.24 0.20'} rg BT /${line.font} ${line.fontSize} Tf 1 0 0 1 48 ${textY} Tm (${pdfEscape(line.text)}) Tj ET`);
          textY -= line.gap;
        });
        return;
      }
      const colors = {
        lead: '0.40 0.52 0.32',
        title: '0.10 0.23 0.18',
        heading: '0.13 0.27 0.20',
        subheading: '0.31 0.45 0.30',
        section: '0.18 0.33 0.23',
        'badge-list': '0.63 0.43 0.18',
        small: '0.43 0.49 0.44',
        source: '0.43 0.49 0.44'
      };
      const color = colors[row.kind] || '0.17 0.24 0.20';
      const text = row.kind === 'bullet' ? `- ${row.text}` : row.text;
      const x = row.kind === 'answer' || row.kind === 'small' ? 54 : 48;
      commands.push(`${color} rg BT /${row.font} ${row.fontSize} Tf 1 0 0 1 ${x} ${row.y} Tm (${pdfEscape(text)}) Tj ET`);
    });
    commands.push('0.78 0.82 0.76 RG 48 43 m 547 43 l S');
    commands.push('0.43 0.48 0.43 rg BT /F1 8 Tf 1 0 0 1 48 29 Tm (GreenerQuest - educational activity estimate) Tj ET');
    const stream = commands.join('\n');
    const streamId = put(`<< /Length ${new TextEncoder().encode(stream).length} >>\nstream\n${stream}\nendstream`);
    const pageId = put(`<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 ${regularFontId} 0 R /F2 ${boldFontId} 0 R >> >> /Contents ${streamId} 0 R >>`);
    pageIds.push(pageId);
  });
  objects[catalogId - 1] = `<< /Type /Catalog /Pages ${pagesId} 0 R >>`;
  objects[pagesId - 1] = `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(' ')}] /Count ${pageIds.length} >>`;

  let pdf = '%PDF-1.4\n%CarbonQuest\n';
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets.push(new TextEncoder().encode(pdf).length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xrefOffset = new TextEncoder().encode(pdf).length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach((offset) => { pdf += `${String(offset).padStart(10, '0')} 00000 n \n`; });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root ${catalogId} 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  return new Blob([pdf], { type: 'application/pdf' });
}

$('#download-button').addEventListener('click', () => {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(participantEmail) || participantEmail.length > 254) {
    showToast('Enter a valid email address in the final section to download your report.');
    return;
  }
  const exportData = buildSubmissionData();
  const blob = createReportPdf(exportData);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `carbon-quest-${activeTrack}-emissions-report.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  showToast('Your emissions report PDF is ready.');
});

async function submitActivitySnapshot() {
  const status = $('#drive-save-status');
  const rawUrl = (window.CARBON_QUEST_SAVE_URL && !window.CARBON_QUEST_SAVE_URL.includes('YOUR_APPS_SCRIPT_WEB_APP_URL_HERE'))
    ? window.CARBON_QUEST_SAVE_URL.trim()
    : (APPS_SCRIPT_WEB_APP_URL.trim() || '/api/submissions');
  const saveUrl = rawUrl;

  if (window.location.protocol === 'file:' && !saveUrl.startsWith('https://')) {
    status.className = 'drive-save-status';
    status.textContent = '';
    status.hidden = true;
    return;
  }

  status.hidden = false;
  status.className = 'drive-save-status is-saving';
  status.textContent = 'Saving your answers and emissions to the database…';

  try {
    const payload = buildSubmissionData();
    const isAppsScript = saveUrl.includes('script.google.com');

    // Use text/plain for Google Apps Script to prevent browser CORS preflight failure
    const response = await fetch(saveUrl, {
      method: 'POST',
      headers: { 'Content-Type': isAppsScript ? 'text/plain;charset=utf-8' : 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok && result.status !== 'success') {
      throw new Error(result.error || result.message || 'The database service could not record the submission.');
    }

    status.className = 'drive-save-status is-success';
    status.textContent = 'Your answers and calculated emissions were added to the GreenerQuest database.';
  } catch (err) {
    console.error('Submission error:', err);
    status.className = 'drive-save-status is-error';
    status.textContent = 'Could not save to the database. You can still download your PDF report.';
  }
}

function showToast(message) {
  const toast = $('#toast');
  toast.textContent = message;
  toast.classList.add('visible');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove('visible'), 2400);
}

const menuToggle = $('.menu-toggle');
const mainNav = $('.main-nav');
menuToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
});
mainNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  mainNav.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open menu');
}));
