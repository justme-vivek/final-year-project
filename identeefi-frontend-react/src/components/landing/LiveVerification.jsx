import React, { useEffect, useRef, useState } from 'react'
import { Box, Button, Container, TextField, Typography } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import { AlertTriangle } from 'lucide-react'
import {
  getSerialNumbers,
  getProductFromServer,
  getProductFromChain,
  getLatestBlock,
} from '../../api/liveChain'
import './ScanTheater.css'

const cells = Array.from({ length: 81 }, (_, i) => (i * 7 + 3) % 10 < 4)

export const LiveVerification = () => {
  const navigate = useNavigate()
  const sectionRef = useRef(null)
  const [visible, setVisible] = useState(true)
  const [record, setRecord] = useState(null) // real registered product
  const [block, setBlock] = useState(null) // live Sepolia block number
  const [status, setStatus] = useState('loading') // loading | ready | error
  const [draft, setDraft] = useState('')

  useEffect(() => {
    const el = sectionRef.current
    if (!el || !('IntersectionObserver' in window)) return
    const obs = new IntersectionObserver(
      entries => {
        setVisible(entries[0]?.isIntersecting !== false)
      },
      { threshold: 0.1 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  // Latest product from the DB — fetched once on mount. The scan theater below
  // is purely visual and never triggers a fetch.
  useEffect(() => {
    let alive = true
    ;(async () => {
      setStatus('loading')
      try {
        const serials = await getSerialNumbers()
        if (!serials.length) throw new Error('no registered products')
        const serial = serials[serials.length - 1] // latest registered product
        const [server, chain, latest] = await Promise.allSettled([
          getProductFromServer(serial),
          getProductFromChain(serial),
          getLatestBlock(),
        ])
        if (!alive) return
        const serverData = server.status === 'fulfilled' ? server.value : null
        const chainData = chain.status === 'fulfilled' ? chain.value : null
        if (latest.status === 'fulfilled') setBlock(latest.value.number)
        if (!serverData?.name && !chainData?.name)
          throw new Error('record empty')
        setRecord({
          serial,
          name: serverData?.name || chainData?.name || 'Registered product',
          brand: serverData?.brand || chainData?.brand || '',
          entries: chainData?.history?.length || 0,
        })
        setStatus('ready')
      } catch (e) {
        if (alive) setStatus('error')
      }
    })()
    return () => {
      alive = false
    }
  }, [])

  // Static verification log — all phases written beforehand, no animation.
  const phases = [
    'PHASE 1 · SCANNING QR FRAME',
    'PHASE 2 · QR CODE DETECTED',
    'PHASE 3 · QUERYING SEPOLIA NETWORK',
    'PHASE 4 · VERIFICATION COMPLETE',
  ]
  const verifyReal = e => {
    e.preventDefault()
    const id = (draft || record?.serial || '').trim().toUpperCase()
    navigate('/scanner', id ? { state: { serial: id } } : undefined)
  }
  return (
    <Box
      id="verify"
      ref={sectionRef}
      sx={{ py: 10, bgcolor: '#050507' }}
      className="below-fold"
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 7 }}>
          <Typography
            sx={{ color: '#6D4AFF', fontSize: '0.75rem', fontWeight: 700, mb: 2 }}
          >
            LIVE VERIFICATION · ON-CHAIN
          </Typography>
          <Typography
            sx={{
              fontSize: 'clamp(1.75rem, 4vw, 2.25rem)',
              fontWeight: 600,
              color: '#F2F0F8',
              mb: 2,
            }}
          >
            VERIFY A PRODUCT
          </Typography>
          <Typography sx={{ color: '#A5A1B2', fontSize: 'clamp(1rem, 2vw, 1.125rem)', lineHeight: 1.6 }}>
          Every product registered on the platform gets a unique on-chain identity anchored on Sepolia. Scan the QR code on any product to instantly verify its authenticity against the live blockchain record.
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(18rem, 1fr))',
            gap: 4,
            width: '100%',
            mx: 'auto',
          }}
        >
          <Box
            sx={{
              bgcolor: '#101016',
              border: '1px solid rgba(255,255,255,0.10)',
              borderRadius: '1.5rem',
              p: 4,
            }}
          >
            <Box
              sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}
            >
              <Box
                className="scan-pulse-dot"
                sx={{
                  width: '0.5rem',
                  height: '0.5rem',
                  borderRadius: '50%',
                  bgcolor: '#6D4AFF',
                }}
              />
              <Typography
                sx={{ color: '#F2F0F8', fontSize: '0.8125rem', fontWeight: 700 }}
              >
                {`SCANNING`}
              </Typography>
            </Box>
            <Box
              sx={{
                position: 'relative',
                maxWidth: '22rem',
                aspectRatio: '1',
                mx: 'auto',
                bgcolor: '#0A0A0F',
                border: '1px solid rgba(109,74,255,0.45)',
                borderRadius: '0.875rem',
                overflow: 'hidden',
                mb: 3,
              }}
            >
              <span className="scan-corner tl" />
              <span className="scan-corner tr" />
              <span className="scan-corner bl" />
              <span className="scan-corner br" />
              <Box
                sx={{
                  position: 'absolute',
                  inset: '2rem',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(9, 1fr)',
                  gap: '0.25rem',
                }}
              >
                {cells.map((on, i) => (
                  <Box
                    key={i}
                    sx={{
                      width: '100%',
                      aspectRatio: '1',
                      borderRadius: '0.125rem',
                      bgcolor: on ? '#F2F0F8' : 'transparent',
                      opacity: 0.9,
                    }}
                  />
                ))}
              </Box>
              {<Box className="scan-line" />}
            </Box>
            <Box
              component="form"
              onSubmit={verifyReal}
              sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}
            >
              <TextField
                value={draft}
                onChange={e => setDraft(e.target.value)}
                size="small"
                fullWidth
                placeholder={'Enter Product Serial ID'}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: '#15151D',
                    color: '#F2F0F8',
                    fontFamily: 'monospace',
                  },
                }}
              />
              <Button
                type="submit"
                sx={{
                  bgcolor: '#6D4AFF',
                  color: '#fff',
                  px: 3,
                  borderRadius: '0.625rem',
                  textTransform: 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                Verify
              </Button>
            </Box>
          </Box>
          <Box
            sx={{
              bgcolor: '#101016',
              border: '1px solid rgba(255,255,255,0.10)',
              borderRadius: '1.5rem',
              p: 4,
            }}
          >
            <Typography
              sx={{
                color: '#706C7A',
                fontSize: '0.75rem',
                fontWeight: 700,
                mb: 2,
              }}
            >
              VERIFICATION LOG
            </Typography>
            <Box
              sx={{
                bgcolor: '#0A0A0F',
                border: '1px solid rgba(255,255,255,0.10)',
                borderRadius: '0.75rem',
                p: 2.5,
                mb: 3,
                minHeight: '6rem',
              }}
            >
              {phases.map(l => (
                <Typography
                  key={l}
                  sx={{
                    fontFamily: 'monospace',
                    fontSize: '0.8125rem',
                    color: '#A5A1B2',
                  }}
                >
                  {l}
                </Typography>
              ))}
            </Box>
            {status === 'loading' && (
              <Box
                sx={{
                  border: '1px solid rgba(109,74,255,0.4)',
                  borderRadius: '0.875rem',
                  p: 3,
                  bgcolor: '#0A0A0F',
                }}
              >
                <Typography sx={{ color: '#8B72FF', fontWeight: 700, mb: 1 }}>
                  FETCHING LIVE RECORD…
                </Typography>
                <Typography sx={{ color: '#A5A1B2', fontSize: '0.8125rem' }}>
                  Querying the backend and Sepolia for a registered product.
                </Typography>
              </Box>
            )}
            {status === 'ready' && record && (
              <Box
                sx={{
                  border: '1px solid rgba(53,201,138,0.4)',
                  borderRadius: '0.875rem',
                  p: 3,
                  bgcolor: '#0A0A0F',
                }}
              >
                <Typography sx={{ color: '#35C98A', fontWeight: 700, mb: 1 }}>
                  AUTHENTIC
                </Typography>
                <Typography
                  sx={{ color: '#F2F0F8', fontSize: '1.1875rem', fontWeight: 600 }}
                >
                  {record.name}
                </Typography>
                {record.brand ? (
                  <Typography
                    sx={{ color: '#A5A1B2', fontSize: '0.8125rem', mb: 1 }}
                  >
                    {record.brand}
                  </Typography>
                ) : null}
                <Typography
                  sx={{
                    color: '#A5A1B2',
                    fontSize: '0.8125rem',
                    fontFamily: 'monospace',
                    mb: 2,
                  }}
                >
                  {record.serial}
                  {block != null ? ` | #${block}` : ''}
                  {record.entries
                    ? ` | ${record.entries} on-chain entries`
                    : ''}
                </Typography>
                <Button
                  component={Link}
                  to="/scanner"
                  fullWidth
                  sx={{
                    bgcolor: '#6D4AFF',
                    color: '#fff',
                    borderRadius: '0.625rem',
                    textTransform: 'none',
                  }}
                >
                  Open Full Scanner
                </Button>
              </Box>
            )}
            {status === 'error' && (
              <Box
                sx={{
                  border: '1px solid rgba(233,185,73,0.4)',
                  borderRadius: '0.875rem',
                  p: 3,
                  bgcolor: '#0A0A0F',
                }}
              >
                <Box
                  sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}
                >
                  <AlertTriangle size={16} color="#E9B949" />
                  <Typography sx={{ color: '#E9B949', fontWeight: 700 }}>
                    LIVE RECORD UNAVAILABLE
                  </Typography>
                </Box>
                <Typography sx={{ color: '#A5A1B2', fontSize: '0.8125rem', mb: 2 }}>
                  Could not reach the backend or Sepolia RPC. Nothing fake is
                  shown here — use the real scanner instead.
                </Typography>
                <Button
                  component={Link}
                  to="/scanner"
                  fullWidth
                  sx={{
                    bgcolor: '#6D4AFF',
                    color: '#fff',
                    borderRadius: '0.625rem',
                    textTransform: 'none',
                  }}
                >
                  Open Full Scanner
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default LiveVerification
