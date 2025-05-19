import json

def add_tags_to_file():
    filename = 'collectedPhotos.json'
    
    try:
        # Load the JSON data
        with open(filename, 'r') as file:
            colleges = json.load(file)
        
        # Add tags based on college key names (most efficient approach)
        for college_key in colleges:
            college_key_lower = college_key.lower()
            
            # Check patterns in the key name first (faster than URL checks)
            if college_key_lower.startswith('iiit-') or 'iiitdm-' in college_key_lower:
                colleges[college_key]['tag'] = "IIIT"
            elif college_key_lower.startswith('iit-'):
                colleges[college_key]['tag'] = "IIT"
            elif college_key_lower.startswith('nit-'):
                colleges[college_key]['tag'] = "NIT"
            elif college_key_lower in ['igdtuw-delhi', 'dtu-delhi', 'nsut-delhi', 
                                       'nsut-delhi-east-campus', 'nsut-delhi-west-campus']:
                colleges[college_key]['tag'] = "JAC"
            else: colleges[college_key]['tag'] = "GFTI"
            
        
        # Save the modified data
        with open(filename, 'w') as file:
            json.dump(colleges, file, indent=2)
        
        print(f"Successfully added tags to colleges in '{filename}'")
        
    except Exception as e:
        print(f"An error occurred: {str(e)}")

if __name__ == "__main__":
    add_tags_to_file()
