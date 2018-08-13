
import { browser, $, ExpectedConditions as EC } from 'protractor'
import { expect } from 'chai'
import { attachFile } from '../../util/attachFile'
import { BasePo } from '../../po/base.po'

describe('Sub Spec 2 describe', () => {

  beforeEach(async () => browser.get('https://google.com'))

  it(`Spec 2 it`, async () => {
    await new BasePo().setInput('#lst-ibDSADA', 'test spec 2')
  })
})

