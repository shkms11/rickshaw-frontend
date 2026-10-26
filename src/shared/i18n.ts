import type { Lang } from "@/shared/types/home.types";

const bengali: Record<string, string> = {
    "Rickshaw System": "রিকশা সিস্টেম",
    Home: "হোম",
    Logout: "লগআউট",
    "Driver Login": "চালক লগইন",
    "Owner Login": "মালিক লগইন",
    "Admin Login": "অ্যাডমিন লগইন",
    "Enter your details to access your account.": "আপনার অ্যাকাউন্টে প্রবেশের তথ্য দিন।",
    Email: "ইমেইল",
    "Enter your email": "আপনার ইমেইল লিখুন",
    "Bangladesh phone number": "বাংলাদেশি ফোন নম্বর",
    "Email (optional)": "ইমেইল (ঐচ্ছিক)",
    "Email or Bangladesh phone": "ইমেইল অথবা বাংলাদেশি ফোন",
    "Email or +8801...": "ইমেইল অথবা +8801...",
    "Enter a valid Bangladesh mobile number, such as +8801712345678":
        "+8801712345678-এর মতো সঠিক বাংলাদেশি মোবাইল নম্বর দিন",
    "Enter a valid email or Bangladesh mobile number":
        "সঠিক ইমেইল অথবা বাংলাদেশি মোবাইল নম্বর দিন",
    driver: "চালক",
    owner: "মালিক",
    user: "ব্যবহারকারী",
    rickshaw: "রিকশা",
    location: "অবস্থান",
    payment: "পেমেন্ট",
    complaint: "অভিযোগ",
    Password: "পাসওয়ার্ড",
    "Enter password": "পাসওয়ার্ড লিখুন",
    Login: "লগইন",
    "Logging in...": "লগইন হচ্ছে...",
    "Show password": "পাসওয়ার্ড দেখান",
    "Hide password": "পাসওয়ার্ড লুকান",
    "This account does not match the selected role.":
        "এই অ্যাকাউন্টটি নির্বাচিত ভূমিকার সঙ্গে মেলে না।",
    "Your account is pending administrator approval. Please try again after it has been approved.":
        "আপনার অ্যাকাউন্ট অ্যাডমিন অনুমোদনের অপেক্ষায় আছে। অনুমোদনের পর আবার চেষ্টা করুন।",
    "Your account was not approved. Please contact an administrator.":
        "আপনার অ্যাকাউন্ট অনুমোদিত হয়নি। অ্যাডমিনের সঙ্গে যোগাযোগ করুন।",
    Back: "ফিরে যান",
    "Driver Registration": "চালক নিবন্ধন",
    "Owner Registration": "মালিক নিবন্ধন",
    "Fill in your information to register.": "নিবন্ধনের জন্য আপনার তথ্য দিন।",
    "Full Name": "পুরো নাম",
    "Driving License Number": "ড্রাইভিং লাইসেন্স নম্বর",
    "Registering...": "নিবন্ধন হচ্ছে...",
    "Register as driver": "চালক হিসেবে নিবন্ধন",
    "Register as owner": "মালিক হিসেবে নিবন্ধন",
    "Registration received. Your account is pending approval. Please log in after an administrator approves it.":
        "নিবন্ধন সম্পন্ন হয়েছে। আপনার অ্যাকাউন্ট অনুমোদনের অপেক্ষায় আছে। অ্যাডমিন অনুমোদন দিলে লগইন করুন।",
    "Admin accounts must be created by an authorized administrator.":
        "অ্যাডমিন অ্যাকাউন্ট অনুমোদিত অ্যাডমিনকে তৈরি করতে হবে।",
    "Super Admin Control Center": "সুপার অ্যাডমিন নিয়ন্ত্রণ কেন্দ্র",
    "Admin Control Center": "অ্যাডমিন নিয়ন্ত্রণ কেন্দ্র",
    "Registration approvals": "নিবন্ধন অনুমোদন",
    "Approve or reject pending driver and owner accounts.":
        "চালক ও মালিকের অপেক্ষমাণ অ্যাকাউন্ট অনুমোদন বা বাতিল করুন।",
    Refresh: "রিফ্রেশ",
    "Loading pending registrations...": "অপেক্ষমাণ নিবন্ধন লোড হচ্ছে...",
    "Could not load registrations. Confirm you are signed in as an admin and try again.":
        "নিবন্ধন লোড করা যায়নি। অ্যাডমিন হিসেবে লগইন করে আবার চেষ্টা করুন।",
    "There are no registrations waiting for approval.":
        "অনুমোদনের অপেক্ষায় কোনো নিবন্ধন নেই।",
    Approve: "অনুমোদন",
    Reject: "বাতিল",
    "The approval decision could not be saved. Please try again.":
        "অনুমোদনের সিদ্ধান্ত সংরক্ষণ করা যায়নি। আবার চেষ্টা করুন।",
    "Total Rickshaws": "মোট রিকশা",
    "Online Drivers": "অনলাইন চালক",
    "Active Trips": "চলমান ট্রিপ",
    "Open Complaints": "অমীমাংসিত অভিযোগ",
    "Could not load dashboard data. Please try again.":
        "ড্যাশবোর্ডের তথ্য লোড করা যায়নি। আবার চেষ্টা করুন।",
    "Traffic Heatmap": "ট্রাফিক হিটম্যাপ",
    "Rickshaw GPS": "রিকশা জিপিএস",
    "Share your live location with your fleet manager while you are on shift.":
        "কাজের সময় আপনার অবস্থান ফ্লিট ম্যানেজারের সঙ্গে শেয়ার করুন।",
    "GPS sharing is on": "জিপিএস শেয়ার চালু",
    "GPS sharing is off": "জিপিএস শেয়ার বন্ধ",
    "Stop sharing": "শেয়ার বন্ধ করুন",
    "Start GPS sharing": "জিপিএস শেয়ার শুরু করুন",
    "Last reported": "সর্বশেষ অবস্থান",
    "Location is shared only while this page is open and GPS sharing is enabled.":
        "এই পৃষ্ঠা খোলা এবং জিপিএস চালু থাকলেই অবস্থান শেয়ার হবে।",
    "Signed in as driver": "চালক হিসেবে লগইন",
    "Driving license": "ড্রাইভিং লাইসেন্স",
    "Live driver locations": "চালকদের লাইভ অবস্থান",
    "Driver locations": "চালকদের অবস্থান",
    "Updates every 15 seconds · OpenStreetMap": "প্রতি ১৫ সেকেন্ডে আপডেট · OpenStreetMap",
    "Refreshes every 15 seconds · Last known points stay visible":
        "প্রতি ১৫ সেকেন্ডে আপডেট · সর্বশেষ জানা অবস্থানও দেখা যাবে",
    "Loading locations...": "অবস্থান লোড হচ্ছে...",
    "Could not load live locations. Check your connection and sign-in.":
        "লাইভ অবস্থান লোড হয়নি। সংযোগ ও লগইন পরীক্ষা করুন।",
    "No drivers are sharing GPS right now.": "এখন কোনো চালক জিপিএস শেয়ার করছেন না।",
    "No vehicle assigned": "কোনো যানবাহন বরাদ্দ নেই",
    live: "লাইভ",
    Live: "লাইভ",
    "last known": "সর্বশেষ",
    "Last known location": "সর্বশেষ জানা অবস্থান",
    "DEMO SAMPLE LOCATION": "ডেমো নমুনা অবস্থান",
    "Vehicle Status": "যানবাহনের অবস্থা",
    "Registered rickshaws": "নিবন্ধিত রিকশা",
    "Active vehicles": "সক্রিয় যানবাহন",
    "Drivers sharing GPS": "জিপিএস শেয়ার করা চালক",
    "See the live map below": "নিচে লাইভ ম্যাপ দেখুন",
    "Register a rickshaw": "রিকশা নিবন্ধন",
    "Add a vehicle to your fleet.": "আপনার বহরে একটি যান যোগ করুন।",
    "Plate number": "নম্বর প্লেট",
    "Model (optional)": "মডেল (ঐচ্ছিক)",
    "Saving...": "সংরক্ষণ হচ্ছে...",
    "Add rickshaw": "রিকশা যোগ করুন",
    "Rickshaw registered.": "রিকশা নিবন্ধিত হয়েছে।",
    "Could not register rickshaw. Check your connection and try again.":
        "রিকশা নিবন্ধন করা যায়নি। সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।",
    "Your fleet": "আপনার বহর",
    "Could not load fleet. Please check your connection and sign-in.":
        "বহরের তথ্য লোড হয়নি। সংযোগ ও লগইন পরীক্ষা করুন।",
    "Loading fleet...": "বহর লোড হচ্ছে...",
    "No vehicles yet. Add your first rickshaw above.":
        "এখনো কোনো যান নেই। উপরে প্রথম রিকশাটি যোগ করুন।",
    "Model not provided": "মডেল দেওয়া হয়নি",
    "No driver assigned": "কোনো চালক বরাদ্দ নেই",
    "ACTIVE": "সক্রিয়",
    "INACTIVE": "নিষ্ক্রিয়",
    "MAINTENANCE": "মেরামত চলছে",
    "A driving license number is required for drivers":
        "চালকের জন্য ড্রাইভিং লাইসেন্স নম্বর প্রয়োজন",
    "This email or driving license number is already registered":
        "এই ইমেইল বা ড্রাইভিং লাইসেন্স নম্বরটি আগে নিবন্ধিত হয়েছে",
    "This email, phone number, or driving license number is already registered":
        "এই ইমেইল, ফোন নম্বর বা ড্রাইভিং লাইসেন্স নম্বর আগে নিবন্ধিত হয়েছে",
    "Your work, in one place": "আপনার কাজ, এক জায়গায়",
    "Choose your account": "আপনার অ্যাকাউন্ট নির্বাচন করুন",
    "Create an account": "অ্যাকাউন্ট তৈরি করুন",
    "Select your role to continue.": "চালিয়ে যেতে আপনার ভূমিকা নির্বাচন করুন।",
    "Choose driver or owner to get started.":
        "শুরু করতে চালক বা মালিক নির্বাচন করুন।",
    "Share your live GPS location.": "আপনার লাইভ জিপিএস অবস্থান শেয়ার করুন।",
    "Manage vehicles and view your fleet.":
        "যানবাহন পরিচালনা ও ফ্লিট দেখুন।",
    "Review accounts and monitor operations.":
        "অ্যাকাউন্ট যাচাই ও কার্যক্রম পর্যবেক্ষণ করুন।",
    "New driver and owner accounts need administrator approval before sign-in.":
        "নতুন চালক ও মালিক অ্যাকাউন্টে লগইনের আগে অ্যাডমিনের অনুমোদন লাগবে।",
    "Global Search": "সার্বিক অনুসন্ধান",
    "Search users, drivers, trips, payments and complaints.":
        "ব্যবহারকারী, চালক, ট্রিপ ও অভিযোগ খুঁজুন।",
    "Search people by name or phone, vehicles by plate, and reported locations.":
        "নাম বা ফোনে মানুষ, নম্বর প্লেটে যানবাহন এবং রিপোর্ট করা অবস্থান খুঁজুন।",
    "Name, phone, plate or place...": "নাম, ফোন, নম্বর প্লেট বা স্থান...",
    "Search admin data": "অ্যাডমিন তথ্য খুঁজুন",
    Rickshaws: "রিকশা",
    "No results found": "কোনো ফলাফল পাওয়া যায়নি",
    "Try a different search term or filter.": "অন্য শব্দ বা ফিল্টার দিয়ে খুঁজুন।",
    "Something went wrong while searching.": "অনুসন্ধানে সমস্যা হয়েছে।",
    "Searching...": "অনুসন্ধান হচ্ছে...",
    "Fleet Owner Dashboard": "ফ্লিট মালিক ড্যাশবোর্ড",
    "Driver Dashboard": "চালক ড্যাশবোর্ড",
    "Rickshaw Tracking System": "রিকশা ট্র্যাকিং সিস্টেম",
    "All rights reserved.": "সর্বস্বত্ব সংরক্ষিত।",
    "Built for": "তৈরি করা হয়েছে",
    "drivers, owners & admins": "চালক, মালিক ও অ্যাডমিনদের জন্য",
};

export function translate(lang: Lang, text: string): string {
    return lang === "bn" ? bengali[text] ?? text : text;
}
