
import { browser, $, ExpectedConditions as EC } from 'protractor'
import { expect } from 'chai'

describe('Spec 4 describe', () => {

  beforeEach(async () => browser.get('https://google.com'))

  it(`Spec 4 it`, async function() {

    this.retries(4)

    await browser.wait(EC.visibilityOf($('#lst-ib')), 5000)
    expect(2).to.eql(1)
    await $('#lst-ib').sendKeys('test spec 4')
  })
})
