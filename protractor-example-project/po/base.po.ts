import { $, browser, ExpectedConditions as EC } from 'protractor'

class BasePo {
  constructor() {
    // some code
  }

  public async setInput(selector: string, value: string) {
    await browser.wait(EC.visibilityOf($(selector)), 1000)
    await $(selector).sendKeys(value)
  }
}

export { BasePo }