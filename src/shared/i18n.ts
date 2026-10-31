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
    "Fleet map": "ফ্লিট ম্যাপ",
    "Refreshes every 15 seconds": "প্রতি ১৫ সেকেন্ডে আপডেট হয়",
    "View location": "অবস্থান দেখুন",
    "Driver location": "চালকের অবস্থান",
    "Current or last reported GPS location": "বর্তমান বা সর্বশেষ জিপিএস অবস্থান",
    "Loading location...": "অবস্থান লোড হচ্ছে...",
    "Could not load driver location.": "চালকের অবস্থান লোড করা যায়নি।",
    "This driver has not shared a GPS location yet.": "এই চালক এখনো জিপিএস অবস্থান শেয়ার করেননি।",
    "Last updated": "সর্বশেষ আপডেট",
    "Only drivers assigned to your fleet are shown.": "শুধু আপনার বহরে বরাদ্দ করা চালকদের দেখানো হচ্ছে।",
    "Driver locations grouped by owner.": "মালিক অনুযায়ী চালকদের অবস্থান দেখানো হচ্ছে।",
    "Grow your fleet with less guesswork": "পরিকল্পিতভাবে আপনার রিকশার বহর বাড়ান",
    "7-day free trial": "৭ দিনের বিনামূল্যের ট্রায়াল",
    "Service active": "সেবা চালু",
    "Trial ended · service continues": "ট্রায়াল শেষ · সেবা চালু আছে",
    "Your free trial ends in": "আপনার বিনামূল্যের ট্রায়াল শেষ হবে",
    days: "দিন",
    "Subscribe before the trial ends to support continued service. All fleet features remain available after the trial.":
        "সেবা চালিয়ে যেতে ট্রায়াল শেষ হওয়ার আগে সাবস্ক্রাইব করুন। ট্রায়াল শেষ হলেও ফ্লিটের সব সুবিধা চালু থাকবে।",
    "This demo account's 7-day trial restarts after expiry. All features remain available; subscribe to support continued service.":
        "এই ডেমো অ্যাকাউন্টের ৭ দিনের ট্রায়াল শেষ হলে আবার শুরু হবে। সব সুবিধা চালু থাকবে; সেবা চালাতে সাবস্ক্রাইব করুন।",
    "Your 7-day free trial has ended.": "আপনার ৭ দিনের বিনামূল্যের ট্রায়াল শেষ হয়েছে।",
    "This seeded demo account will receive a fresh 7-day trial the next time it is opened. All demo features remain available.":
        "এই ডেমো অ্যাকাউন্ট পরেরবার খোলার সময় নতুন ৭ দিনের ট্রায়াল পাবে। ডেমোর সব সুবিধা চালু থাকবে।",
    "All dashboard features remain available. Subscribe to support continued service.":
        "ড্যাশবোর্ডের সব সুবিধা চালু থাকবে। সেবা চালিয়ে যেতে সাবস্ক্রাইব করুন।",
    "Trial ended": "ট্রায়াল শেষ",
    "All features remain available": "সব সুবিধা চালু আছে",
    "Subscribe to support the service": "সেবা চালাতে সাবস্ক্রাইব করুন",
    "Checkout unavailable until payment API is configured": "পেমেন্ট API কনফিগার না করা পর্যন্ত পেমেন্ট চালু হবে না",
    "Payment checkout is optional. Plan details and fleet features remain available without payment API setup.":
        "পেমেন্ট চেকআউট ঐচ্ছিক। পেমেন্ট API সেটআপ ছাড়াই প্ল্যানের তথ্য ও ফ্লিটের সব সুবিধা ব্যবহার করা যাবে।",
    "Payment checkout is not configured. Plan details and fleet features are still available.":
        "পেমেন্ট চেকআউট কনফিগার করা হয়নি। প্ল্যানের তথ্য ও ফ্লিটের সব সুবিধা চালু আছে।",
    "You can use the dashboard, GPS map, and plan details without payment gateway credentials. Configure SSLCOMMERZ_IS_LIVE, SSLCOMMERZ_STORE_ID, and SSLCOMMERZ_STORE_PASSWORD in the backend environment when you are ready to accept payments. Keep gateway secrets on the backend only.":
        "পেমেন্ট গেটওয়ের তথ্য ছাড়াই ড্যাশবোর্ড, জিপিএস ম্যাপ ও প্ল্যানের তথ্য ব্যবহার করুন। পেমেন্ট চালু করতে ব্যাকএন্ডে SSLCOMMERZ_IS_LIVE, SSLCOMMERZ_STORE_ID এবং SSLCOMMERZ_STORE_PASSWORD সেট করুন। গোপন তথ্য শুধু ব্যাকএন্ডে রাখুন।",
    "Keep your vehicles and drivers organized, see the latest GPS reports, and make better day-to-day decisions from one simple dashboard.":
        "একটি সহজ ড্যাশবোর্ডে যানবাহন ও চালকদের পরিচালনা করুন, সর্বশেষ জিপিএস দেখুন এবং দৈনন্দিন কাজে ভালো সিদ্ধান্ত নিন।",
    "Live GPS tracking for your assigned drivers": "বরাদ্দ করা চালকদের লাইভ জিপিএস ট্র্যাকিং",
    "Manage every rickshaw from one fleet dashboard": "একটি ড্যাশবোর্ড থেকে সব রিকশা পরিচালনা",
    "Assign approved drivers and see their status": "অনুমোদিত চালক বরাদ্দ ও তাদের অবস্থা দেখুন",
    "Get fleet alerts and request admin support": "বহরের সতর্কতা পান ও অ্যাডমিন সহায়তা চান",
    "Simple monthly pricing. Pay only for vehicles in your fleet.":
        "সহজ মাসিক মূল্য। আপনার বহরের যানবাহনের জন্যই শুধু পেমেন্ট করুন।",
    "Loading your plan...": "আপনার প্ল্যান লোড হচ্ছে...",
    "Could not load your subscription details.": "সাবস্ক্রিপশনের তথ্য লোড করা যায়নি।",
    Retry: "আবার চেষ্টা করুন",
    Unavailable: "পাওয়া যায়নি",
    "Free trial ends": "বিনামূল্যের ট্রায়াল শেষ হবে",
    "Access through": "সেবা চালু থাকবে",
    "days left": "দিন বাকি",
    "Monthly fleet plan": "মাসিক বহর প্ল্যান",
    month: "মাস",
    "managed rickshaws": "পরিচালিত রিকশা",
    "rickshaw / month": "রিকশা / মাস",
    "Connecting to secure checkout...": "নিরাপদ পেমেন্টে সংযোগ হচ্ছে...",
    "Pay monthly": "মাসিক পেমেন্ট করুন",
    "Register a rickshaw to see your monthly price and subscribe.":
        "মাসিক মূল্য দেখতে ও সাবস্ক্রাইব করতে একটি রিকশা নিবন্ধন করুন।",
    "SSLCommerz sandbox · Test payment only": "SSLCommerz স্যান্ডবক্স · শুধু পরীক্ষামূলক পেমেন্ট",
    "Secure checkout powered by SSLCommerz": "SSLCommerz-এর নিরাপদ পেমেন্ট",
    "Trial dates will appear when subscription details are available.":
        "সাবস্ক্রিপশনের তথ্য পাওয়া গেলে ট্রায়ালের তারিখ দেখানো হবে।",
    "Subscription details are currently unavailable. Your fleet and plan information remain visible.":
        "সাবস্ক্রিপশনের তথ্য এখন পাওয়া যাচ্ছে না। আপনার বহর ও প্ল্যানের তথ্য দেখা যাচ্ছে।",
    "Could not load subscription dates or checkout status.":
        "সাবস্ক্রিপশনের তারিখ বা পেমেন্টের অবস্থা লোড করা যায়নি।",
    "Payment gateway setup (optional)": "পেমেন্ট গেটওয়ে সেটআপ (ঐচ্ছিক)",
    "Payment confirmed. Your monthly service is active.": "পেমেন্ট নিশ্চিত। আপনার মাসিক সেবা চালু হয়েছে।",
    "Payment was cancelled. Your trial or subscription is unchanged.":
        "পেমেন্ট বাতিল হয়েছে। আপনার ট্রায়াল বা সাবস্ক্রিপশনে পরিবর্তন হয়নি।",
    "Payment could not be confirmed. Please try checkout again.":
        "পেমেন্ট নিশ্চিত করা যায়নি। আবার চেষ্টা করুন।",
    "Could not start payment. Please try again.": "পেমেন্ট শুরু করা যায়নি। আবার চেষ্টা করুন।",
    "Register at least one rickshaw before choosing a monthly plan":
        "মাসিক প্ল্যান বেছে নেওয়ার আগে অন্তত একটি রিকশা নিবন্ধন করুন",
    "Updates every 15 seconds · OpenStreetMap": "প্রতি ১৫ সেকেন্ডে আপডেট · OpenStreetMap",
    "Refreshes every 15 seconds · Last known points stay visible":
        "প্রতি ১৫ সেকেন্ডে আপডেট · সর্বশেষ জানা অবস্থানও দেখা যাবে",
    "Loading locations...": "অবস্থান লোড হচ্ছে...",
    "Could not load live locations. Check your connection and sign-in.":
        "লাইভ অবস্থান লোড হয়নি। সংযোগ ও লগইন পরীক্ষা করুন।",
    "No drivers are sharing GPS right now.": "এখন কোনো চালক জিপিএস শেয়ার করছেন না।",
    "No vehicle assigned": "কোনো যানবাহন বরাদ্দ নেই",
    "Not assigned to an owner": "কোনো মালিকের অধীনে বরাদ্দ নয়",
    "GPS coordinates": "জিপিএস স্থানাঙ্ক",
    "Reported accuracy": "জিপিএসের জানানো নির্ভুলতা",
    Vehicle: "যানবাহন",
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
    "Notice board": "নোটিশ বোর্ড",
    "Turn on GPS sharing while working so your assigned vehicle can be tracked.":
        "কাজের সময় জিপিএস চালু রাখুন, যাতে বরাদ্দকৃত যানটি ট্র্যাক করা যায়।",
    "Use the lost-rickshaw alert immediately if your assigned vehicle is missing.":
        "বরাদ্দকৃত যানটি হারিয়ে গেলে সঙ্গে সঙ্গে হারানো রিকশার সতর্কতা পাঠান।",
    "Send account or vehicle problems to the admin team from this dashboard.":
        "এই ড্যাশবোর্ড থেকে অ্যাকাউন্ট বা যানবাহনের সমস্যা অ্যাডমিনকে জানান।",
    "Search approved drivers by phone number before assigning a vehicle.":
        "যান বরাদ্দের আগে ফোন নম্বর দিয়ে অনুমোদিত চালক খুঁজুন।",
    "A vehicle removal request takes effect only after admin approval.":
        "অ্যাডমিন অনুমোদনের পরেই যান সরানোর অনুরোধ কার্যকর হবে।",
    "Lost-rickshaw alerts and admin decisions appear in your fleet.":
        "হারানো রিকশার সতর্কতা ও অ্যাডমিনের সিদ্ধান্ত আপনার বহরে দেখা যাবে।",
    "Review vehicle removal requests and lost-rickshaw alerts promptly.":
        "যান সরানোর অনুরোধ ও হারানো রিকশার সতর্কতা দ্রুত পর্যালোচনা করুন।",
    "Use fleet controls to update vehicle and driver statuses.":
        "বহর নিয়ন্ত্রণ থেকে যান ও চালকের অবস্থা হালনাগাদ করুন।",
    "Registration approvals and user reports are available below.":
        "নিবন্ধন অনুমোদন ও ব্যবহারকারীর রিপোর্ট নিচে পাওয়া যাবে।",
    "Search approved driver by phone": "ফোন নম্বর দিয়ে অনুমোদিত চালক খুঁজুন",
    "Find driver": "চালক খুঁজুন",
    "No approved driver found for this phone.": "এই নম্বরে কোনো অনুমোদিত চালক পাওয়া যায়নি।",
    "Assign driver": "চালক বরাদ্দ করুন",
    "Unassign driver": "চালককে অব্যাহতি দিন",
    "Already assigned to": "ইতোমধ্যে বরাদ্দ",
    "Phone unavailable": "ফোন নম্বর নেই",
    "Search approved drivers by phone, check GPS, and request admin help for fleet changes.":
        "ফোনে অনুমোদিত চালক খুঁজুন, জিপিএস দেখুন, এবং বহরের পরিবর্তনে অ্যাডমিনের সহায়তা চান।",
    "Request removal": "সরানোর অনুরোধ",
    "Awaiting admin approval": "অ্যাডমিন অনুমোদনের অপেক্ষায়",
    "Sending request...": "অনুরোধ পাঠানো হচ্ছে...",
    "Ask admin to remove": "অ্যাডমিনকে সরানোর অনুরোধ জানান",
    "Removal request sent. Admin approval is required.":
        "সরানোর অনুরোধ পাঠানো হয়েছে। অ্যাডমিনের অনুমোদন প্রয়োজন।",
    "Removal request is waiting for admin approval.":
        "সরানোর অনুরোধ অ্যাডমিন অনুমোদনের অপেক্ষায় আছে।",
    "Admin rejected the vehicle removal request.":
        "অ্যাডমিন যান সরানোর অনুরোধ প্রত্যাখ্যান করেছেন।",
    "Admin approved the vehicle removal request.":
        "অ্যাডমিন যান সরানোর অনুরোধ অনুমোদন করেছেন।",
    "Lost-rickshaw alert sent by": "রিকশা হারানোর সতর্কতা পাঠিয়েছেন",
    "Report rickshaw lost": "রিকশা হারানোর রিপোর্ট দিন",
    "Lost-rickshaw alert is open": "হারানো রিকশার সতর্কতা খোলা আছে",
    "Sending alert...": "সতর্কতা পাঠানো হচ্ছে...",
    "Warn the owner and admin that": "মালিক ও অ্যাডমিনকে জানান যে",
    "is lost?": "হারিয়ে গেছে কি?",
    "Lost-rickshaw alert sent to the owner and admin.":
        "মালিক ও অ্যাডমিনের কাছে হারানো রিকশার সতর্কতা পাঠানো হয়েছে।",
    "Could not send alert. Please contact the admin team.":
        "সতর্কতা পাঠানো যায়নি। অ্যাডমিন টিমের সঙ্গে যোগাযোগ করুন।",
    "Assigned rickshaw": "বরাদ্দকৃত রিকশা",
    "Could not load assigned vehicle details.": "বরাদ্দকৃত যানের তথ্য লোড করা যায়নি।",
    "Loading assigned vehicle...": "বরাদ্দকৃত যানের তথ্য লোড হচ্ছে...",
    "No rickshaw is assigned to your account. Contact your fleet owner.":
        "আপনার অ্যাকাউন্টে কোনো রিকশা বরাদ্দ নেই। ফ্লিট মালিকের সঙ্গে যোগাযোগ করুন।",
    Owner: "মালিক",
    "GPS is live": "জিপিএস লাইভ",
    "GPS is not sharing": "জিপিএস শেয়ার হচ্ছে না",
    "The owner and admin have been alerted.": "মালিক ও অ্যাডমিনকে সতর্ক করা হয়েছে।",
    "Could not load alert status.": "সতর্কতার অবস্থা লোড করা যায়নি।",
    "Report a problem": "সমস্যা রিপোর্ট করুন",
    "Send a vehicle, account, or safety issue to the admin team.":
        "যানবাহন, অ্যাকাউন্ট বা নিরাপত্তার সমস্যা অ্যাডমিন টিমকে জানান।",
    "Fleet alerts and requests": "বহরের সতর্কতা ও অনুরোধ",
    "Review lost-vehicle alerts and owner removal requests.":
        "হারানো যানবাহনের সতর্কতা ও মালিকের সরানোর অনুরোধ পর্যালোচনা করুন।",
    "Loading fleet alerts...": "বহরের সতর্কতা লোড হচ্ছে...",
    "No fleet alerts or requests need review.": "পর্যালোচনার জন্য কোনো বহর সতর্কতা বা অনুরোধ নেই।",
    "Lost vehicle alert": "হারানো যানবাহনের সতর্কতা",
    "Vehicle removal request": "যান সরানোর অনুরোধ",
    "Reported by": "রিপোর্ট করেছেন",
    "Mark resolved": "সমাধান হয়েছে চিহ্নিত করুন",
    "Approve removal": "সরানো অনুমোদন করুন",
    "Could not update fleet action.": "বহরের কার্যক্রম হালনাগাদ করা যায়নি।",
    "Admin fleet controls": "অ্যাডমিন বহর নিয়ন্ত্রণ",
    "Update vehicle service status and driver availability.":
        "যানের পরিষেবা অবস্থা ও চালকের উপস্থিতি হালনাগাদ করুন।",
    "Loading fleet controls...": "বহর নিয়ন্ত্রণ লোড হচ্ছে...",
    "Could not load fleet controls.": "বহর নিয়ন্ত্রণ লোড করা যায়নি।",
    Vehicles: "যানবাহন",
    Drivers: "চালক",
    "Driver status": "চালকের অবস্থা",
    "Vehicle status updated.": "যানের অবস্থা হালনাগাদ হয়েছে।",
    "Could not update vehicle status.": "যানের অবস্থা হালনাগাদ করা যায়নি।",
    "Driver status updated.": "চালকের অবস্থা হালনাগাদ হয়েছে।",
    "Could not update driver status.": "চালকের অবস্থা হালনাগাদ করা যায়নি।",
    "No vehicles registered.": "কোনো যান নিবন্ধিত নেই।",
    "No drivers registered.": "কোনো চালক নিবন্ধিত নেই।",
    "Owner and driver reports": "মালিক ও চালকের রিপোর্ট",
    "Review reports and mark issues resolved when handled.":
        "রিপোর্ট পর্যালোচনা করে সমাধান হলে চিহ্নিত করুন।",
    "Loading reports...": "রিপোর্ট লোড হচ্ছে...",
    "Could not load reports.": "রিপোর্ট লোড করা যায়নি।",
    "No reports have been submitted.": "কোনো রিপোর্ট জমা পড়েনি।",
    Reopen: "আবার খুলুন",
    OPEN: "খোলা",
    RESOLVED: "সমাধান হয়েছে",
    ONLINE: "অনলাইন",
    OFFLINE: "অফলাইন",
    ON_TRIP: "ট্রিপে",
    "Could not update report status.": "রিপোর্টের অবস্থা হালনাগাদ করা যায়নি।",
    "Could not change vehicle status while it has an active trip":
        "ট্রিপ চলাকালে যানের অবস্থা পরিবর্তন করা যাবে না",
    "Cannot change vehicle status while it has an active trip":
        "ট্রিপ চলাকালে যানের অবস্থা পরিবর্তন করা যাবে না",
    "Driver must share GPS before being marked online":
        "অনলাইনে চিহ্নিত হওয়ার আগে চালককে জিপিএস শেয়ার করতে হবে",
    "Could not update rickshaw status": "রিকশার অবস্থা হালনাগাদ করা যায়নি",
    "Could not update rickshaw driver": "রিকশার চালক হালনাগাদ করা যায়নি",
    "Only active rickshaws can be assigned a driver":
        "শুধু সক্রিয় রিকশায় চালক বরাদ্দ করা যাবে",
    "Cannot request removal while the rickshaw has an active trip":
        "ট্রিপ চলাকালে রিকশা সরানোর অনুরোধ করা যাবে না",
    "A removal request is already awaiting admin approval":
        "একটি সরানোর অনুরোধ ইতিমধ্যে অ্যাডমিন অনুমোদনের অপেক্ষায় আছে",
    "An open lost-rickshaw alert already exists":
        "হারানো রিকশার একটি সতর্কতা ইতিমধ্যে খোলা আছে",
    "Lost-rickshaw alerts must be resolved": "হারানো রিকশার সতর্কতা সমাধান করতে হবে",
    "Removal requests must be approved or rejected":
        "সরানোর অনুরোধ অনুমোদন বা প্রত্যাখ্যান করতে হবে",
    "Fleet action has already been reviewed": "বহরের কার্যক্রম ইতিমধ্যে পর্যালোচনা করা হয়েছে",
    "Cannot approve removal while the rickshaw has an active trip":
        "ট্রিপ চলাকালে রিকশা সরানো অনুমোদন করা যাবে না",
    "Choose an allowed review status": "সঠিক পর্যালোচনা অবস্থা নির্বাচন করুন",
    "A valid rickshaw is required": "সঠিক রিকশা নির্বাচন করুন",
    "Assigned rickshaw not found": "বরাদ্দকৃত রিকশা পাওয়া যায়নি",
    "Only an owner or assigned driver can report a lost rickshaw":
        "শুধু মালিক বা বরাদ্দকৃত চালক রিকশা হারানোর রিপোর্ট দিতে পারেন",
    "Enter a valid Bangladesh mobile number": "সঠিক বাংলাদেশি মোবাইল নম্বর দিন",
    "Report sent to admin.": "অ্যাডমিনের কাছে রিপোর্ট পাঠানো হয়েছে।",
    "Could not load fleet alerts and requests.": "বহরের সতর্কতা ও অনুরোধ লোড করা যায়নি।",
    "Assigned driver": "বরাদ্দকৃত চালক",
    "Assign approved drivers, check GPS status, or remove vehicles from active service.":
        "অনুমোদিত চালক বরাদ্দ করুন, জিপিএস অবস্থা দেখুন, অথবা সক্রিয় বহর থেকে যান সরান।",
    "Driver assignment updated.": "চালক বরাদ্দ হালনাগাদ হয়েছে।",
    "Saving assignment...": "বরাদ্দ সংরক্ষণ হচ্ছে...",
    "Loading approved drivers...": "অনুমোদিত চালকদের তথ্য লোড হচ্ছে...",
    "Could not load approved drivers.": "অনুমোদিত চালকদের তথ্য লোড করা যায়নি।",
    "No approved available drivers.": "কোনো অনুমোদিত ও উপলভ্য চালক নেই।",
    "Could not load vehicle tracking status.": "যানের ট্র্যাকিং অবস্থা লোড করা যায়নি।",
    "Live location": "লাইভ অবস্থান",
    "No driver location reported": "চালকের কোনো অবস্থান পাওয়া যায়নি",
    Remove: "সরান",
    "Removing...": "সরানো হচ্ছে...",
    Restore: "পুনরুদ্ধার",
    "Restoring...": "পুনরুদ্ধার হচ্ছে...",
    "from your active fleet? It will be deactivated, not deleted.":
        "আপনার সক্রিয় বহর থেকে সরাবেন? এটি নিষ্ক্রিয় হবে, মুছে যাবে না।",
    "Rickshaw removed from active fleet.": "রিকশাটি সক্রিয় বহর থেকে সরানো হয়েছে।",
    "Rickshaw restored to active fleet.": "রিকশাটি সক্রিয় বহরে ফিরিয়ে আনা হয়েছে।",
    "Could not update the fleet. Check your connection and try again.":
        "বহর হালনাগাদ করা যায়নি। সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।",
    "Cannot change the driver while the rickshaw has an active trip":
        "রিকশার ট্রিপ চলাকালে চালক পরিবর্তন করা যাবে না",
    "Cannot remove a rickshaw while it has an active trip":
        "ট্রিপ চলাকালে রিকশা সরানো যাবে না",
    "Approved driver not found": "অনুমোদিত চালক পাওয়া যায়নি",
    "Unassign this driver from their current rickshaw first":
        "এই চালককে বর্তমান রিকশা থেকে আগে অব্যাহতি দিন",
    "This driver is assigned to another owner's rickshaw":
        "এই চালক অন্য মালিকের রিকশায় বরাদ্দ আছেন",
    "This driver is already assigned to another rickshaw":
        "এই চালক অন্য একটি রিকশায় বরাদ্দ আছেন",
    "Report a fleet problem": "বহরের সমস্যা রিপোর্ট করুন",
    "Send an issue about your fleet to the admin team.":
        "আপনার বহরের সমস্যা অ্যাডমিন টিমকে জানান।",
    Subject: "বিষয়",
    "Describe the problem": "সমস্যার বিবরণ দিন",
    "Sending...": "পাঠানো হচ্ছে...",
    "Send report": "রিপোর্ট পাঠান",
    "Could not submit the report. Check your connection and try again.":
        "রিপোর্ট পাঠানো যায়নি। সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।",
    "Enter a subject and a description of at least 10 characters":
        "বিষয় লিখুন এবং অন্তত ১০ অক্ষরে সমস্যার বিবরণ দিন",
    "Could not submit the report": "রিপোর্ট জমা দেওয়া যায়নি",
    "Could not load available drivers": "উপলভ্য চালকদের তথ্য লোড করা যায়নি",
    "Choose a valid driver or leave the vehicle unassigned":
        "সঠিক চালক নির্বাচন করুন অথবা যানটি চালকবিহীন রাখুন",
    "Could not update driver assignment": "চালক বরাদ্দ হালনাগাদ করা যায়নি",
    "Could not remove rickshaw from fleet": "বহর থেকে রিকশা সরানো যায়নি",
    "Could not restore rickshaw to fleet": "বহরে রিকশা ফিরিয়ে আনা যায়নি",
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
    Dashboard: "ড্যাশবোর্ড",
    "Rickshaw Tracking System": "রিকশা ট্র্যাকিং সিস্টেম",
    "Rickshaw AI assistant": "রিকশা এআই সহকারী",
    "Role-based fleet help": "ভূমিকা অনুযায়ী ফ্লিট সহায়তা",
    "General help · no login needed": "সাধারণ সহায়তা · লগইন লাগবে না",
    "Groq AI": "Groq এআই",
    "Built-in assistant · no API key": "অন্তর্নির্মিত সহকারী · API key লাগবে না",
    Guest: "অতিথি",
    "Ask a question. Your answers only include information your role is allowed to see.":
        "প্রশ্ন করুন। আপনার ভূমিকার অনুমতিপ্রাপ্ত তথ্যই শুধু উত্তরে থাকবে।",
    "Ask a general question or learn about the fleet app. Sign in for private fleet insights.":
        "সাধারণ প্রশ্ন করুন বা ফ্লিট অ্যাপ সম্পর্কে জানুন। ব্যক্তিগত ফ্লিট তথ্যের জন্য লগইন করুন।",
    "Thinking...": "ভাবছি...",
    "Ask the assistant": "সহকারীকে প্রশ্ন করুন",
    "Type a question...": "প্রশ্ন লিখুন...",
    "Send message": "বার্তা পাঠান",
    "Open AI assistant": "এআই সহকারী খুলুন",
    "Close assistant": "সহকারী বন্ধ করুন",
    "Show fleet summary": "ফ্লিটের সারসংক্ষেপ দেখান",
    "Where is driver shamusl?": "চালক শামসুল কোথায়?",
    "How many rickshaws in Dhaka?": "ঢাকায় কতটি রিকশা আছে?",
    "Show traffic usage by area": "এলাকাভিত্তিক ট্রাফিক ব্যবহার দেখান",
    "Show my fleet summary": "আমার ফ্লিটের সারসংক্ষেপ দেখান",
    "Where is my assigned driver?": "আমার বরাদ্দ চালক কোথায়?",
    "Show my fleet's busiest areas": "আমার ফ্লিটের ব্যস্ততম এলাকা দেখান",
    "What is GPS tracking?": "জিপিএস ট্র্যাকিং কী?",
    "Show my driver status": "আমার চালক অবস্থা দেখান",
    "How do I share GPS?": "আমি কীভাবে জিপিএস শেয়ার করব?",
    "Give me road safety tips": "সড়ক নিরাপত্তার পরামর্শ দিন",
    "What can this app do?": "এই অ্যাপ কী করতে পারে?",
    "How does GPS tracking work?": "জিপিএস ট্র্যাকিং কীভাবে কাজ করে?",
    "All rights reserved.": "সর্বস্বত্ব সংরক্ষিত।",
    "Built for": "তৈরি করা হয়েছে",
    "drivers, owners & admins": "চালক, মালিক ও অ্যাডমিনদের জন্য",
};

/** Looks up exact English UI strings in the Bengali dictionary and falls back unchanged. */
export function translate(lang: Lang, text: string): string {
    return lang === "bn" ? bengali[text] ?? text : text;
}
