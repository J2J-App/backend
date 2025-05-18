import json
import os

colleges = [
        "nit-jalandhar", "nit-jaipur", "nit-bhopal", "nit-allahabad", "nit-agartala", "nit-calicut", "nit-delhi",
        "nit-durgapur", "nit-goa", "nit-hamirpur", "nit-surathkal", "nit-meghalaya", "nit-patna","nit-puducherry",
        "nit-raipur", "nit-sikkim", "nit-arunachal-pradesh", "nit-jamshedpur", "nit-kurukshetra", "nit-mizoram",
        "nit-rourkela", "nit-silchar", "nit-srinagar", "nit-trichy", "nit-uttarakhand","nit-warangal", "nit-surat",
        "nit-nagpur","nit-nagaland","nit-manipur","nit-agartala",

        "iit-bhubaneswar", "iit-bombay","iit-mandi", "iit-delhi", "iit-indore", "iit-kharagpur", "iit-hyderabad",
        "iit-jodhpur", "iit-kanpur", "iit-madras", "iit-gandhinagar", "iit-patna", "iit-roorkee", "iit-ism-dhanbad",
        "iit-ropar", "iit-bhu-varanasi", "iit-guwahati", "iit-bhilai", "iit-goa", "iit-palakkad", "iit-tirupati",
        "iit-jammu", "iit-dharwad",
        
        "iiit-guwahati",
        "iiitm-gwalior",
        "iiit-kota",
        "iiit-surat",
        "iiit-sonepat",
        "iiit-una",
        "iiit-sri-city",
        "iiit-vadodara",
        "iiit-allahabad",
        "iiitdm-kancheepuram",
        "iiitdm-jabalpur",
        "iiit-manipur",
        "iiit-trichy",
        "iiit-dharwad",
        "iiitdm-kurnool",
        "iiit-ranchi",
        "iiit-nagpur",
        "iiit-pune",
        "iiit-kalyani",
        "iiit-lucknow",
        "iiit-kottayam",
        "bit-mesra",
        "bit-patna",
        "pec-chandigarh",
        "iiest-shibpur",
        "uoh-hyderabad",
        "tssot-silchar",
        "spa-bhopal",
        "spa-delhi",
        "soe-tezpur",
        "ptu-puducherry",
        "niftem-thanjavur",
        "niamt-ranchi",
        "jnu-delhi",
        "jkiapt-allahabad",
        "ict-ioc-bhubaneswar",
        "gkv-haridwar",
        "iitram-ahmedabad",
        "gsv-vadodara",
        "dtu-delhi","nsut-delhi-west-campus","nsut-delhi-east-campus","nsut-delhi","igdtuw-delhi","iiit-delhi"
]

collected_data={}
input_dir = r"C:\Users\user\Documents\GitHub\backend\src\data-about"

for col in colleges:
    input_file = os.path.join(input_dir,f"{col}-about-data.json")
    with open(input_file,'r') as f:
        data = json.load(f)
        currentUniData=data[col]
        photos = currentUniData["photos"]
        collected_data[col] = photos
        
output_file = os.path.join(input_dir,"collectedPhotos.json")
with open(output_file,"w") as f:
    json.dump(collected_data,f)