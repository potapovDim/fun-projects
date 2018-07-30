
import { browser, $, ExpectedConditions as EC } from 'protractor'
import { expect } from 'chai'

describe('Spec 3 describe', () => {

  beforeEach(async () => browser.get('https://google.com'))

  it(`Spec 3 it`, async () => {
    await browser.wait(EC.visibilityOf($('#lst-ib')), 5000)
    await $('#lst-ib').sendKeys('test spec 3')
  })
})
