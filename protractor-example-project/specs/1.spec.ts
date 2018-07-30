
import { browser, $, ExpectedConditions as EC } from 'protractor'
import { expect } from 'chai'

describe('Spec 1 describe', () => {
  beforeEach(async () => browser.get('https://google.com'))

  it(`Spec 1 it`, async () => {
    await browser.wait(EC.visibilityOf($('#lst-ib')), 5000)
    await $('#lst-ib').sendKeys('test spec 1')
  })
})
