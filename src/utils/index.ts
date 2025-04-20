export const ToFullName = (lastName: string, middleName: string, firstName: string, language: string) => { 
    if (language === "vi") {
        return `${lastName ? lastName : ""} ${middleName ? middleName : ""} ${firstName ? firstName : ""}`.trim()
    }
    return `${firstName ? firstName : ""} ${middleName ? middleName : ""} ${lastName ? lastName : ""}`.trim()
}

export const convertBase64ToFile = (file: File) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
});

export const separationFullName = (fullName: string, language: string) => { 
    const result = {
        firstName: "",
        middleName: "",
        lastName: ""
    }
    if (language === "vi") {
        const arrFullName = fullName.trim().split(" ")?.filter(Boolean);
        if (arrFullName.length === 1) {
            if (language === "vi") {
                result.lastName = arrFullName.join();
            } else if (language === "en") {
                result.lastName = arrFullName.join();
            }
        } else if (arrFullName.length === 2) {
            if (language === "vi") {
                result.lastName = arrFullName[0];
                result.firstName = arrFullName[1];
            }else {
                result.firstName = arrFullName[0];
                result.lastName = arrFullName[1];
            }
        }else if (arrFullName.length >= 3) {
            if (language === "vi") {
                result.lastName = arrFullName[0];
                result.middleName = arrFullName.slice(1, arrFullName.length - 1).join(" ");
                result.firstName = arrFullName[arrFullName.length - 1];
            }else {
                result.firstName = arrFullName[0];
                result.middleName = arrFullName.slice(1, arrFullName.length - 1).join(" ");
                result.lastName = arrFullName[arrFullName.length - 1];
            }
        }
    }

    return result;
}