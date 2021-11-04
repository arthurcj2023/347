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


async function generateInstagram(email) {
    let driver = await new Builder().forBrowser("chrome").build();
    await driver.get("https://www.instagram.com/accounts/emailsignup/");
    await sleep(2000);
    await driver.findElement(By.name("emailOrPhone")).sendKeys(email);
    let firstName = generateUsername(6);
    let lastName = generateUsername(6);
    await driver.findElement(By.name("fullName")).sendKeys(firstName + " " + lastName);
    let username = generateUsername(10);
    await driver.findElement(By.name("username")).sendKeys(username);
    let password = generatePassword(10);
    await driver.findElement(By.name("password")).sendKeys(password);
    await driver.findElement(By.xpath("//*[text()='Sign up']")).click();
    await sleep(2000);
    await driver.actions({ bridge: true }).sendKeys(Key.TAB, Key.TAB, Key.RETURN, Key.UP, Key.UP, Key.UP, Key.RETURN).perform();
    await sleep(1000);
    await driver.actions({ bridge: true }).sendKeys(Key.TAB, Key.TAB, Key.TAB, Key.RETURN, Key.UP, Key.UP, Key.RETURN).perform();
    await driver.actions({ bridge: true }).sendKeys(Key.TAB, Key.TAB, Key.TAB, Key.TAB, Key.RETURN).perform();
    for (let i = 0; i < 18; i++) {
        await driver.actions({ bridge: true }).sendKeys(Key.DOWN).perform();
    }
    await driver.actions({ bridge: true }).sendKeys(Key.RETURN, Key.TAB, Key.RETURN).perform();
    driver.close();
}
generateInstagram("kaotiqcj@gmail.com");