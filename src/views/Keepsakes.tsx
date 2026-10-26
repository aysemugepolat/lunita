import { useEffect, useState } from 'react'
import { ConnectKitButton } from 'connectkit'
import { ExternalLink, Loader2, Lock } from 'lucide-react'
import { useAccount, useReadContract, useSwitchChain, useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import { arcTestnet } from 'viem/chains'
import { Seal } from '@/art/Ornaments'
import { ACHIEVEMENTS } from '@/game/data'
import { KEEPSAKES_ABI, KEEPSAKES_ADDRESS } from '@/game/keepsakes'
import { useGame } from '@/game/store'
import { buildAddressExplorerUrl, buildTxExplorerUrl } from '@/onchain-facts'

const KEEPSAKE_ACHIEVEMENTS = ACHIEVEMENTS.filter((a) => a.keepsake !== undefined)

function friendlyError(e: unknown): string {
  const m = (e as { message?: string })?.message?.toLowerCase() ?? ''
  if (m.includes('user rejected') || m.includes('denied')) return 'No problem, nothing was sent.'
  if (m.includes('insufficient') || m.includes('exceeds balance')) return 'Your wallet needs a little test USDC for gas. Use "Get test USDC" in the sidebar.'
  if (m.includes('alreadyclaimed')) return 'This keepsake is already yours.'
  return 'That did not go through. Please try again in a moment.'
}

export default function Keepsakes() {
  const { save } = useGame()
  const { address, isConnected, chainId } = useAccount()
  const { switchChainAsync } = useSwitchChain()
  const { writeContractAsync, data: hash, isPending, reset } = useWriteContract()
  const { isLoading: confirming, isSuccess } = useWaitForTransactionReceipt({ hash })
  const [pendingId, setPendingId] = useState<number | null>(null)
  const [error, setError] = useState('')

  const claimed = useReadContract({
    address: KEEPSAKES_ADDRESS,
    abi: KEEPSAKES_ABI,
    functionName: 'claimedBy',
    args: address ? [address] : undefined,
    chainId: arcTestnet.id,
    query: { enabled: !!KEEPSAKES_ADDRESS && !!address },
  })

  useEffect(() => {
    if (isSuccess) {
      void claimed.refetch()
      setPendingId(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess])

  const claim = async (id: number) => {
    if (!KEEPSAKES_ADDRESS) return
    setError('')
    setPendingId(id)
    reset()
    try {
      if (chainId !== arcTestnet.id) await switchChainAsync({ chainId: arcTestnet.id })
      await writeContractAsync({ address: KEEPSAKES_ADDRESS, abi: KEEPSAKES_ABI, functionName: 'claim', args: [id], chainId: arcTestnet.id })
    } catch (e) {
      setPendingId(null)
      setError(friendlyError(e))
    }
  }

  return (
    <section className="space-y-4">
      <div className="page-dark p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-4">
          <Seal size={64} />
          <div className="min-w-[220px] flex-1">
            <h2 className="font-display text-3xl font-semibold text-ivory-100">Arc keepsakes</h2>
            <p className="text-ivory-200/90">Optional. Turn milestones into digital collectibles you own, on Arc Testnet. They are cosmetic keepsakes with no monetary value, and the game plays fully without them.</p>
          </div>
          <ConnectKitButton />
        </div>
        {KEEPSAKES_ADDRESS && (
          <a className="mt-3 inline-flex items-center gap-1.5 text-sm text-gold-300 underline-offset-2 hover:underline" href={buildAddressExplorerUrl(arcTestnet.id, KEEPSAKES_ADDRESS)} target="_blank" rel="noopener noreferrer">
            View the keepsakes contract <ExternalLink size={14} />
          </a>
        )}
      </div>

      {!KEEPSAKES_ADDRESS && (
        <p className="page p-4 text-ink-800">Keepsakes are not switched on for this realm yet.</p>
      )}

      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {KEEPSAKE_ACHIEVEMENTS.map((a) => {
          const id = a.keepsake as number
          const earned = !!save.achievements[a.id]
          const owned = claimed.data?.[id] === true
          const busy = pendingId === id && (isPending || confirming)
          return (
            <li key={a.id} className={`page flex flex-col gap-2 p-4 ${earned ? '' : 'opacity-70'}`}>
              <div className="flex items-start gap-3">
                <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-full border ${earned ? 'border-gold-500 bg-burgundy-700' : 'border-ink-700/30 bg-ivory-200'}`}>
                  {earned ? <Seal size={36} /> : <Lock size={16} className="text-ink-700/50" />}
                </span>
                <div className="min-w-0">
                  <h3 className="font-display text-xl font-semibold leading-tight text-ink-800">{a.name}</h3>
                  <p className="text-sm text-ink-700/80">{a.desc}</p>
                </div>
              </div>
              {owned ? (
                <p className="small-caps text-burgundy-600">In your wallet</p>
              ) : (
                <button className="btn-primary !min-h-[44px] w-full" disabled={!earned || !KEEPSAKES_ADDRESS || !isConnected || busy || !!hash && confirming} onClick={() => void claim(id)}>
                  {busy ? <><Loader2 size={16} className="animate-spin" /> {isPending ? 'Confirm in wallet' : 'Confirming'}</> : earned ? (isConnected ? 'Claim keepsake' : 'Connect to claim') : 'Not earned yet'}
                </button>
              )}
            </li>
          )
        })}
      </ul>

      {error && <p className="page p-3 text-burgundy-700" role="alert">{error}</p>}
      {hash && isSuccess && (
        <p className="page p-3 text-ink-800">
          Keepsake claimed. <a className="inline-flex items-center gap-1 text-burgundy-700 underline" href={buildTxExplorerUrl(arcTestnet.id, hash)} target="_blank" rel="noopener noreferrer">View transaction <ExternalLink size={14} /></a>
        </p>
      )}
    </section>
  )
}
