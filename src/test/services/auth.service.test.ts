import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'

vi.mock('axios')

const mockPost = vi.mocked(axios.post)

describe('auth.service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('login sends form-urlencoded data', async () => {
    mockPost.mockResolvedValueOnce({
      data: { access_token: 'token123', token_type: 'bearer', user: { id: 1, username: 'Giovapolis', email: 'test@test.com' } },
    })

    const { login } = await import('@/services/auth.service')
    const result = await login('Giovapolis', 'GioAdmin2026')

    expect(mockPost).toHaveBeenCalledWith(
      'http://localhost:8000/auth/login',
      expect.any(URLSearchParams),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
    )
    expect(result.access_token).toBe('token123')
  })

  it('login rejects invalid credentials', async () => {
    mockPost.mockRejectedValueOnce(new Error('401'))

    const { login } = await import('@/services/auth.service')
    await expect(login('bad', 'wrong')).rejects.toThrow()
  })
})
