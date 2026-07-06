import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'

vi.mock('axios')

const mockGet = vi.mocked(axios.get)
const mockPut = vi.mocked(axios.put)

describe('profile.service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('getProfile fetches from /profile/', async () => {
    mockGet.mockResolvedValueOnce({
      data: { name: 'Giovapolis', title: 'Dev', id: 1 },
    })

    const { getProfile } = await import('@/services/profile.service')
    const result = await getProfile()

    expect(mockGet).toHaveBeenCalledWith('http://localhost:8000/profile/')
    expect(result?.name).toBe('Giovapolis')
  })

  it('updateProfile sends PUT with token', async () => {
    mockPut.mockResolvedValueOnce({
      data: { name: 'Updated', title: 'Senior', id: 1 },
    })

    const { updateProfile } = await import('@/services/profile.service')
    const result = await updateProfile('mytoken', { name: 'Updated' })

    expect(mockPut).toHaveBeenCalledWith(
      'http://localhost:8000/profile/',
      { name: 'Updated' },
      { headers: { Authorization: 'Bearer mytoken' } },
    )
    expect(result.name).toBe('Updated')
  })
})
