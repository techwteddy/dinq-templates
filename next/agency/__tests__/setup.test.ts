/**
 * Basic test to verify Jest and testing environment are configured correctly
 */

describe('Testing Environment Setup', () => {
  it('should run basic tests', () => {
    expect(true).toBe(true)
  })

  it('should have access to DOM APIs', () => {
    const div = document.createElement('div')
    expect(div).toBeInstanceOf(HTMLDivElement)
  })
})
