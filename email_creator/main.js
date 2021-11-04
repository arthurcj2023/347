const { Builder, By, Capabilities, Key } = require("selenium-webdriver");
const chrome = require('selenium-webdriver/chrome');

const usernameCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const passwordCharacters = '!@#$%&'

function generateUsername(length) {
    let username = '';
    for (let i = 0; i < length; i++) {
        username += usernameCharacters.charAt(Math.floor(Math.random() * usernameCharacters.length));
    }
    return username;
}

function generatePassword() {
    let password = generateUsername(10);
    password.concat(passwordCharacters.charAt(Math.floor(Math.random() * passwordCharacters.length)));
    return password;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const names = [];
function load_names() {

}

function getName() {

}

function getPhoneNumber() {
    return "7037058881";
}

function getConfirmationMessage() {
    return "000000";
}


async function generateEmail() {
    let driver = await new Builder().forBrowser("chrome").build();
    await driver.get("http://google.com");
    await driver.findElement(By.xpath("//*[text()='Sign in']")).click();
    await driver.findElement(By.xpath("//*[text()='Create account']")).click();
    await driver.findElement(By.xpath("//*[text()='For myself']")).click();
    let firstName = getName();
    await driver.findElement(By.name("firstName")).sendKeys(firstName);
    let lastName = getName();
    await driver.findElement(By.name("lastName")).sendKeys(lastName);
    let username = generateUsername(20);
    await driver.findElement(By.name("Username")).sendKeys(username);
    let password = generatePassword();
    await driver.findElement(By.name("Passwd")).sendKeys(password);
    await driver.findElement(By.name("ConfirmPasswd")).sendKeys(password);
    await driver.actions({ bridge: true }).sendKeys(Key.TAB, Key.TAB, Key.RETURN).perform();
    let phoneNumber = getPhoneNumber();
    await sleep(1000);
    await driver.actions({ bridge: true }).sendKeys(Key.TAB, Key.TAB, Key.TAB).perform();
    await driver.actions({ bridge: true }).sendKeys(phoneNumber).perform();
    await driver.actions({ bridge: true }).sendKeys(Key.TAB, Key.RETURN).perform();
    await sleep(1000);
    let confimationCode = getConfirmationMessage();

}
generateEmail();