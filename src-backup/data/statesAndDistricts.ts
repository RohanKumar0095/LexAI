export interface StateInfo {
  code: string;
  name: string;
  districts: string[];
}

export const statesAndDistricts: StateInfo[] = [
  {
    code: "DL",
    name: "Delhi",
    districts: [
      "Central Delhi",
      "East Delhi",
      "New Delhi",
      "North Delhi",
      "North East Delhi",
      "North West Delhi",
      "Shahdara",
      "South Delhi",
      "South East Delhi",
      "South West Delhi",
      "West Delhi"
    ]
  },
  {
    code: "MH",
    name: "Maharashtra",
    districts: [
      "Mumbai City",
      "Mumbai Suburban",
      "Pune",
      "Nagpur",
      "Thane",
      "Nashik",
      "Aurangabad",
      "Navi Mumbai",
      "Solapur",
      "Kolhapur",
      "Amravati"
    ]
  },
  {
    code: "KA",
    name: "Karnataka",
    districts: [
      "Bengaluru Urban",
      "Bengaluru Rural",
      "Mysore",
      "Hubli-Dharwad",
      "Mangaluru (Dakshina Kannada)",
      "Belagavi",
      "Kalaburagi",
      "Davangere",
      "Ballari",
      "Udupi"
    ]
  },
  {
    code: "UP",
    name: "Uttar Pradesh",
    districts: [
      "Lucknow",
      "Kanpur Nagar",
      "Gautam Buddha Nagar (Noida)",
      "Ghaziabad",
      "Varanasi",
      "Agra",
      "Prayagraj (Allahabad)",
      "Meerut",
      "Bareilly",
      "Aligarh",
      "Gorakhpur"
    ]
  },
  {
    code: "TN",
    name: "Tamil Nadu",
    districts: [
      "Chennai",
      "Coimbatore",
      "Madurai",
      "Tiruchirappalli (Trichy)",
      "Salem",
      "Tirunelveli",
      "Vellore",
      "Thanjavur",
      "Erode",
      "Kanchipuram"
    ]
  },
  {
    code: "WB",
    name: "West Bengal",
    districts: [
      "Kolkata",
      "Howrah",
      "Darjeeling",
      "Hooghly",
      "North 24 Parganas",
      "South 24 Parganas",
      "Paschim Medinipur",
      "Purba Medinipur",
      "Malda",
      "Murshidabad"
    ]
  },
  {
    code: "GJ",
    name: "Gujarat",
    districts: [
      "Ahmedabad",
      "Surat",
      "Vadodara",
      "Rajkot",
      "Gandhinagar",
      "Bhavnagar",
      "Jamnagar",
      "Junagadh",
      "Anand",
      "Mehsana"
    ]
  },
  {
    code: "BR",
    name: "Bihar",
    districts: [
      "Patna",
      "Gaya",
      "Muzaffarpur",
      "Bhagalpur",
      "Darbhanga",
      "Purnia",
      "Ara (Bhojpur)",
      "Biharsharif (Nalanda)",
      "Begusarai",
      "Katihar"
    ]
  },
  {
    code: "KL",
    name: "Kerala",
    districts: [
      "Thiruvananthapuram",
      "Kochi (Ernakulam)",
      "Kozhikode",
      "Thrissur",
      "Kannur",
      "Kollam",
      "Alappuzha",
      "Kottayam",
      "Palakkad",
      "Malappuram"
    ]
  },
  {
    code: "TG",
    name: "Telangana",
    districts: [
      "Hyderabad",
      "Warangal Urban",
      "Nizamabad",
      "Karimnagar",
      "Khammam",
      "Rangareddy",
      "Medchal-Malkajgiri",
      "Mahabubnagar",
      "Nalgonda"
    ]
  }
];

export const getDistrictsForState = (stateName: string): string[] => {
  const foundState = statesAndDistricts.find(
    (s) => s.name.toLowerCase() === stateName.toLowerCase()
  );
  return foundState ? foundState.districts : [];
};
