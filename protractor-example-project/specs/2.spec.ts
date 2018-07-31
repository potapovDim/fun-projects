
import { browser, $, ExpectedConditions as EC } from 'protractor'
import { expect } from 'chai'
import { attachFile } from '../util/attachFile'

require('protractor/built/logger').Logger.prototype.info

describe('Spec 2 describe', () => {

  beforeEach(async () => browser.get('https://google.com'))

  it(`Spec 2 it`, async () => {

    await browser.wait(EC.visibilityOf($('#lst-ibDSADA')), 1000)
    await $('#lst-ib').sendKeys('test spec 2')
  })
})
