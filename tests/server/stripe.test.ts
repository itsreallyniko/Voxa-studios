import { describe, it, expect, vi, beforeEach } from 'vitest'

const piCreate = vi.fn()
vi.mock('stripe', () => {
  class FakeStripe {
    paymentIntents = { create: piCreate }
  }
  return { default: FakeStripe }
})

beforeEach(() => {
  vi.resetAllMocks()
  vi.resetModules()
  process.env.STRIPE_SECRET_KEY = 'sk_test_123'
})

describe('createManualCaptureIntent', () => {
  it('creates a PI with manual capture and returns client secret', async () => {
    piCreate.mockResolvedValue({
      id: 'pi_abc',
      client_secret: 'pi_abc_secret',
      amount: 40000,
      status: 'requires_payment_method',
    })

    const { createManualCaptureIntent } = await import('@/lib/server/stripe')
    const r = await createManualCaptureIntent({
      amountCents: 40000,
      metadata: { setId: 'executive-podcast' },
      idempotencyKey: 'wiz-123',
    })

    expect(piCreate).toHaveBeenCalledOnce()
    const [args, opts] = piCreate.mock.calls[0]
    expect(args.amount).toBe(40000)
    expect(args.currency).toBe('usd')
    expect(args.capture_method).toBe('manual')
    expect(args.metadata.setId).toBe('executive-podcast')
    expect(opts.idempotencyKey).toBe('wiz-123')

    expect(r.clientSecret).toBe('pi_abc_secret')
    expect(r.id).toBe('pi_abc')
    expect(args.automatic_payment_methods).toEqual({ enabled: true })
    expect(args.payment_method_types).toBeUndefined()
  })
})

describe('createDepositIntent', () => {
  it('is card only, sends a receipt and a description', async () => {
    piCreate.mockResolvedValue({ id: 'pi_dep', client_secret: 'pi_dep_secret' })
    const { createDepositIntent } = await import('@/lib/server/stripe')
    const r = await createDepositIntent({
      amountCents: 141000,
      metadata: { kind: 'package_deposit' },
      idempotencyKey: 'package-deposit:s1',
      receiptEmail: 'jane@example.com',
      description: 'Voxa package deposit (course)',
    })
    const [args, opts] = piCreate.mock.calls[0]
    expect(args.payment_method_types).toEqual(['card'])
    expect(args.automatic_payment_methods).toBeUndefined()
    expect(args.receipt_email).toBe('jane@example.com')
    expect(args.description).toBe('Voxa package deposit (course)')
    expect(args.capture_method).toBeUndefined()
    expect(opts.idempotencyKey).toBe('package-deposit:s1')
    expect(r).toEqual({ id: 'pi_dep', clientSecret: 'pi_dep_secret' })
  })
})
