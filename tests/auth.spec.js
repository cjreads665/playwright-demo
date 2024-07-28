// @ts-check
const { test, expect } = require('@playwright/test');
/**
 * the following code is not following the DRY principles and does not have any custom fixtures to avoid it. 
 */


test.beforeEach("access the login page and assert the presence of UI copy on screen",async ({page})=>{
  await page.goto('https://demo.haroldwaste.com/authentication');
  await expect(page.locator(".headroom")).toBeVisible();
  await expect(page).toHaveTitle(/Jules.ai/);
  await expect(page.locator('//p[text()="Log in"]')).toBeVisible();
  await expect(page.locator('//p[text()="Optimize and control your sourcing of recycled materials conveniently."]')).toBeVisible()
})

const checkErrCount = async (page,condition,numberOfElem) =>{
  switch (condition) {
    case "less":
      await expect(await page.locator('//div[text()="Required"]').count()).toBeLessThanOrEqual(numberOfElem);
      break;
    
    case "greater":
      await expect(await page.locator('//div[text()="Required"]').count()).toBeGreaterThan(1);
      break;

    default:
      break;
  }
}

const isErrVisible = async (page,condition) =>{
  switch (condition) {
    case true:
      await expect((page.locator('//div[text()="Required"]').first())).toBeVisible();
      break;
    
    case false:
      await expect((page.locator('//div[text()="Required"]').first())).toBeHidden();

    default:
      break;
  }
}

test('Auth - incorrect login details gives error', async ({ page }) => {

  await page.locator('[name="email"]').fill("example@gmail.com");

  // await expect(page.locator('//div[text()="Required"]')).toBeHidden();
  isErrVisible(page,false)
  await page.locator('form').click();

  await page.locator('[name="password"]').fill("password");
  await page.locator('form').click();

  // await expect(page.locator('//div[text()="Required"]')).toBeHidden();
  checkErrCount(page,"less",0)
  isErrVisible(page,false)
  await page.locator('[data-test-id="signin"]').click();
  isErrVisible(page,false)

});

test('Auth - assert the presence of negative messages for empty fields without clicking login', async ({ page }) => {

  await page.locator('[name="email"]').click();
  
  await page.locator('form').click();

  // console.log(await page.locator('//div[text()="Required"]').all())
  // await expect(page.locator('//div[text()="Required"]')).toBeVisible();
  // await expect(await page.locator('//div[text()="Required"]').count()).toBeLessThan(2);
  checkErrCount(page,"less",2)
  await page.locator('[name="password"]').click();
  await page.locator('form').click();
  // await expect(await page.locator('//div[text()="Required"]').count()).toBeLessThanOrEqual;
  checkErrCount(page,"greater",1)

});

test('Auth - assert the presence of negative messages for empty fields after clicking login', async({page})=>{

const signInButton = page.locator('[data-test-id="signin"]');
  console.log(await signInButton.isVisible());  // Add debug info
  await expect(signInButton).toBeVisible();
  await signInButton.click();
  isErrVisible(page,true)
  await checkErrCount(page,"greater",1)

})