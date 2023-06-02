//set width of results and info divs to the same as the input form width
window.onload = () => {
    document.querySelector("#resultsContainer").style.width = window.getComputedStyle(document.querySelector("#inputsContainer")).getPropertyValue("width");
    document.querySelector("#infoContainer").style.width = window.getComputedStyle(document.querySelector("#inputsContainer")).getPropertyValue("width");
};

const KILOGRAMS_PER_POUND = 0.4536;
const CENTIMETERS_PER_INCH = 2.54;
const CM2_PER_M2 = 10000;

const MIN_CAL_FEMALE = 1200;
const MIN_CAL_MALE = 1500;

const MALE_CAL_MODIFIER = 5;
const FEMALE_CAL_MODIFIER = -161;


function validateFormInputs(inputs) {
    inputs.age = parseInt(document.querySelector("#age").value);
    inputs.weight = parseInt(document.querySelector("#weight").value);
    inputs.height = parseInt(document.querySelector("#height").value);

    inputs.bodyFatPercent = parseInt(document.querySelector("#bodyFatPercent").value);
    inputs.bodyFatEntered = false;

    if (!isNaN(inputs.bodyFatPercent)) {
        inputs.bodyFatEntered = true;

        if (isNaN(inputs.bodyFatPercent) || inputs.bodyFatPercent < 0 || inputs.bodyFatPercent > 100) {
            alert("Please enter a valid body fat percentage!");
            return false;
        }
    }

    if (isNaN(inputs.age) || inputs.age === "" || inputs.age < 0) {    
        alert("Please enter a valid age!");
        return false;
    }

    if (isNaN(inputs.weight) || inputs.weight === "" || inputs.weight < 0) {    
        alert("Please enter a valid weight!");
        return false;
    }

    if (isNaN(inputs.height) || inputs.height === "" || inputs.height < 0) {    
        alert("Please enter a valid height!");
        return false;
    }


    // getting values of dropdowns
    const gender = document.querySelector("#gender");
    const weightUnit = document.querySelector("#weightUnit");
    const heightUnit = document.querySelector("#heightUnit");
    const activityLevel = document.querySelector("#activityLevel");

    inputs.gender = gender.options[gender.selectedIndex].value;
    inputs.weightUnit = weightUnit.options[weightUnit.selectedIndex].value;
    inputs.heightUnit = heightUnit.options[heightUnit.selectedIndex].value;
    inputs.activityLevel = activityLevel.options[activityLevel.selectedIndex].value;

    return true;
}



function calculateTDEEnoBF(gender, age, weight, weightUnit, height, heightUnit, activityMultiplier) {
    // Mifflin St. Jeor
    // Mifflin = (10.m + 6.25h - 5.0a) + s
    // m is mass in kg, h is height in cm, a is age in years, s is +5 for males and -151 for females
    
    const safeMinCalories = (gender === "M") ? MIN_CAL_MALE : MIN_CAL_FEMALE;
    const genderModifier = (gender === "M") ? MALE_CAL_MODIFIER : FEMALE_CAL_MODIFIER;

    if (weightUnit === "LBS") {
        weight *= KILOGRAMS_PER_POUND;
    }

    if (heightUnit === "IN") {
        height *= CENTIMETERS_PER_INCH;
    }

    const BMR = (10 * weight) + (6.25 * height) - (5.0 * age) + genderModifier;

    // if tdee is under safe min calories, then set tdee to safe min calories
    const TDEE = Math.max(safeMinCalories, Math.round(BMR * activityMultiplier)).toFixed(1);

    // const TDEE = Math.max(safeMinCalories, Math.round(BMR * activityMultiplier));

    return TDEE;
}



function calculateTDEEwithBF(gender, weight, weightUnit, bodyFatPercent, activityMultiplier) {
    // Katch-McArdle
    // Katch = 370 + (21.6 * LBM)
    // where LBM is lean body mass 

    const safeMinCalories = (gender === "M") ? MIN_CAL_MALE : MIN_CAL_FEMALE;

    if (weightUnit === "LBS") {
        weight *= KILOGRAMS_PER_POUND;
    }

    const LBM = (100 - bodyFatPercent) * 0.01 * weight;
    const BMR = (21.6 * LBM) + 370;

    const TDEE = Math.round(BMR * activityMultiplier);

    return TDEE;
}



function calculateBMI(weight, weightUnit, height, heightUnit) {
    // BMI = [weight(kg) / height(cm) / height(cm)] * 10,000

    if (weightUnit === "LBS") {
        weight *= KILOGRAMS_PER_POUND;
    }

    if (heightUnit === "IN") {
        height *= CENTIMETERS_PER_INCH;
    }

    const BMI = ((weight / height) / height) * CM2_PER_M2;

    return BMI.toFixed(1);
}


function printOutput(TDEE, BMI, gender, age) {
    safeMinCalories = (gender === "M") ? MIN_CAL_MALE : MIN_CAL_FEMALE;

    BMI = parseFloat(BMI);
    age = parseFloat(age);

    if (BMI < 18.5) {
        BMI_RANGE = "suy dinh dưỡng";
    }
    else if (BMI < 25) {
        BMI_RANGE = "khoẻ mạnh";
    }
    else if (BMI < 30) {
        BMI_RANGE = "thừa cân";
    }
    else {
        BMI_RANGE = "béo phì";
    }
    if (age >= 3 && age <= 18) {
        age_menu = "Trẻ em";
    
        if (age >= 13 && age <= 18) {
            age_menu = "Vị thành niên";
            value = "Đây là tuổi dậy thì nên dinh dưỡng buổi sáng là cần: <br/>\
            Uống đủ nước, tăng cường vận động thể thao ngoài trời, ngủ sớm và đủ giấc, bổ sung các loại vitamin \
            Tăng cường canxi cho trẻ bằng thực phẩm hoặc viên uống";
            
            if (gender !== "M") {
                result = "Bổ sung chất sắt (20mg sắt/ngày) <br/> Bằng thực phẩm (thịt, gà, cá, trứng, các loại hạt và đậu)<br/> viên uống (sử dụng trước giờ ăn sáng hoặc ăn trưa)";
            } else {
                result = "";
            }
        } else {
            value = "";
            result = "";
        }
    
        if (age >= 3 && age <= 12 && BMI < 18.5) {
            suggest = "Lời khuyên: bổ sung thức ăn kèm cho buổi sáng: <br/> .Phô mai <br/> .Sữa";
        } else if (age >= 3 && age <= 12 && BMI > 25) {
            suggest = "Lời khuyên: cho trẻ tập luyện thể thao (bơi, võ, ...),<br/> giảm ăn các loại thức ăn nhanh (khoai tây chiên, gà rán, ...)";
        }
    }
    else if (age > 18 && age <= 50) {
        age_menu = "Người trưởng thành";
    }
    else if (age > 50 && age <= 70) {
        age_menu = "Người cao ";
        suggest = "Lời khuyên: <br/> Khẩu phần ăn đủ nhu cầu và cân đối các chất dinh dưỡng gồm: Chất đạm, béo, tinh bột, vitamin, khoáng chất, nước và chất xơ;\
        Chế biến thức ăn dễ tiêu hóa, nên có món canh trong bữa ăn;\
        Không bỏ qua bất kỳ bữa ăn nào trong ngày;\
        Có kế hoạch về thực đơn, theo dõi, đánh giá bữa ăn;\
        Theo dõi cân nặng, vòng eo, tỷ lệ mỡ cơ thể."
    }
    else {
        age_menu = "none";
    }
    
  


    let infoHTML = 
        `TDEE của bạn là <strong>${Math.round((Math.max(TDEE, safeMinCalories)*0.2))}</strong> calories mỗi buổi sáng.
        <br/>
         BMI của bạn là <strong>${BMI}</strong>, which is <strong>${BMI_RANGE}</strong>.;
        <br/> ${value} <hr/>${result}`


    let resultsHTML = 
        `Thực đơn phù hợp với bạn  <strong> ${age_menu} </strong><br/>
        Để giảm 2 kg/tuần, ăn <strong>${(Math.max(TDEE - 1000, safeMinCalories))*0,45359237 }</strong> calories mỗi ngày.<br/>
        Để giảm 1 kg/tuần, ăn <strong>${(Math.max(TDEE - 500, safeMinCalories))*0,45359237 }</strong> calories mỗi ngày.<br/>
        Để duy trì cân nặng, ăn <strong>${(Math.max(TDEE, safeMinCalories))*0,45359237 }</strong> calories mỗi ngày.<br/>
        Để tăng 1 kg/tuần, ăn <strong>${(Math.max(TDEE + 500, safeMinCalories))*0,45359237 }</strong> calories mỗi ngày.<br/>
        Để tăng 2 kg/tuần, ăn <strong>${(Math.max(TDEE + 1000, safeMinCalories))*0,45359237 }</strong> calories mỗi ngày.
        <hr/>${suggest}
         `

    
    const safeMinCaloriesRegex = new RegExp(safeMinCalories, "g");
    document.querySelector("#resultsContainer").innerHTML = resultsHTML.replace(safeMinCaloriesRegex, `<abbr title='${((gender === "M") ? "Men" : "Women")} are not advised to consume less than ${safeMinCalories} calories per day.'>${safeMinCalories}</abbr>`);
    document.querySelector("#infoContainer").innerHTML = infoHTML.replace(safeMinCaloriesRegex, `<abbr title='${((gender === "M") ? "Men" : "Women")} are not advised to consume less than ${safeMinCalories} calories per day.'>${safeMinCalories}</abbr>`);
    
    document.querySelector("#resultsContainer").style.visibility = "visible";
    document.querySelector("#infoContainer").style.visibility = "visible";
}


function formSubmit() {
    const inputs = {
        age: -1,

        weight: -1,
        weightUnit: "LBS",

        height: -1,
        heightUnit: "IN",

        bodyFatEntered: false,
        bodyFatPercent: -1,

        gender: "M",
        activityLevel: -1,
    };
    if (!validateFormInputs(inputs)) {
        return;
    }
    else {
        const TDEE = (inputs.bodyFatEntered) ? calculateTDEEwithBF(inputs.gender, inputs.weight, inputs.weightUnit, inputs.bodyFatPercent, inputs.activityLevel) : calculateTDEEnoBF(inputs.gender, inputs.age, inputs.weight, inputs.weightUnit, inputs.height, inputs.heightUnit, inputs.activityLevel);

        const BMI = calculateBMI(inputs.weight, inputs.weightUnit, inputs.height, inputs.heightUnit);
        
        printOutput(TDEE, BMI, inputs.gender, inputs.age);
        // printOutput1(inputs.age);

    }
}
document.querySelector("#submitBtn").addEventListener("click", formSubmit);
