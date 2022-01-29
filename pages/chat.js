import { Box, Text, TextField, Image, Button } from '@skynexui/components'
import React from 'react'
import appConfig from '../config.json'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

export default function ChatPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  const [mensagem, setMensagem] = React.useState('')
  const [listaDeMensagens, setListaDeMensagens] = React.useState([])

  React.useEffect(() => {
    supabase
      .from('mensagens')
      .select('*')
      .order('id', { ascending: false })
      .then(({ data }) => {
        console.log('Dados da consulta', data)
        setListaDeMensagens(data)
      })
  }, [])

  const router = useRouter()
  const { username } = router.query
  const [name, setName] = useState('Loading...')
  useEffect(() => setName(username), [])

  function handleNovaMensagem(novaMensagem) {
    const mensagem = {
      de: username,
      texto: novaMensagem
    }
    supabase
      .from('mensagens')
      .insert([mensagem])
      .then(({ data }) => {
        setListaDeMensagens([data[0], ...listaDeMensagens])
      })
    setMensagem('')
  }

  function removeMensagem(id) {
    supabase
      .from('mensagens')
      .delete()
      .match({ id })
      .then(() => {
        let novaListaDeMensagens = listaDeMensagens.filter(mensagem => {
          if (mensagem.id !== id) {
            return mensagem
          }
        })
        setListaDeMensagens(novaListaDeMensagens)
      })
  }

  return (
    <>
      <link
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
        rel="stylesheet"
      ></link>
      <Box
        styleSheet={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: appConfig.theme.colors.primary[500],
          backgroundImage: `url(https://imagens.publico.pt/imagens.aspx/1574515?tp=UH&db=IMAGENS&type=GIF&w=1800&act=resize)`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundBlendMode: 'multiply',
          color: appConfig.theme.colors.neutrals['000']
        }}
      >
        <Box
          styleSheet={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
            borderRadius: '5px',
            backgroundColor: appConfig.theme.colors.neutrals[700],
            height: '100%',
            maxWidth: '80%',
            maxHeight: '95vh',
            padding: '32px'
          }}
        >
          <Header />
          <Box
            styleSheet={{
              position: 'relative',
              display: 'flex',
              flex: 1,
              height: '80%',
              backgroundColor: appConfig.theme.colors.neutrals[600],
              flexDirection: 'column',
              borderRadius: '5px',
              padding: '16px'
            }}
          >
            <MessageList
              mensagens={listaDeMensagens}
              removeMensagem={removeMensagem}
            />

            <Box
              as="form"
              styleSheet={{
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <TextField
                value={mensagem}
                onChange={event => {
                  const valor = event.target.value
                  setMensagem(valor)
                }}
                onKeyPress={event => {
                  if (event.key === 'Enter') {
                    event.preventDefault()
                    handleNovaMensagem(mensagem)
                  }
                }}
                placeholder="Insira sua mensagem aqui..."
                type="textarea"
                styleSheet={{
                  width: '100%',
                  border: '0',
                  resize: 'none',
                  borderRadius: '5px',
                  padding: '6px 8px',
                  paddingRight: '45px',
                  backgroundColor: appConfig.theme.colors.neutrals[800],
                  color: appConfig.theme.colors.neutrals[200]
                }}
              />
              <Button
                onClick={() => {
                  handleNovaMensagem(mensagem)
                }}
                colorVariant="neutral"
                label={<span class="material-icons">send</span>}
                styleSheet={{
                  background: 'none',
                  position: 'absolute',
                  right: '15px',
                  bottom: '24px',
                  hover: {
                    backgroundColor: appConfig.theme.colors.neutrals[500]
                  }
                }}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  )
}

function Header() {
  return (
    <>
      <Box
        styleSheet={{
          width: '100%',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Text
          variant="heading5"
          styleSheet={{
            color: 'white'
          }}
        >
          Chat
        </Text>
        <Button
          variant="tertiary"
          colorVariant="neutral"
          label="Logout"
          href="/"
          styleSheet={{
            color: appConfig.theme.colors.neutrals[200],
            hover: {
              backgroundColor: appConfig.theme.colors.primary[700]
            }
          }}
        />
      </Box>
    </>
  )
}

function MessageList(props) {
  return (
    <Box
      tag="ul"
      styleSheet={{
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column-reverse',
        flex: 1,
        color: appConfig.theme.colors.neutrals['000'],
        marginBottom: '16px',
        overflow: 'hidden'
      }}
    >
      {props.mensagens.map(mensagem => {
        return (
          <Text
            key={mensagem.id}
            tag="li"
            styleSheet={{
              borderRadius: '5px',
              padding: '6px',
              marginBottom: '12px',
              hover: {
                backgroundColor: appConfig.theme.colors.neutrals[700]
              },
              active: {
                backgroundColor: appConfig.theme.colors.primary[800]
              },
              wordBreak: 'break-all'
            }}
          >
            <Box
              styleSheet={{
                alignItems: 'center',
                marginBottom: '8px',
                position: 'relative'
              }}
            >
              <Image
                styleSheet={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  display: 'inline-block',
                  marginRight: '8px'
                }}
                src={`https://github.com/${mensagem.de}.png`}
              />
              <Text tag="strong">{mensagem.de}</Text>
              <Text
                styleSheet={{
                  fontSize: '10px',
                  marginLeft: '8px',
                  color: appConfig.theme.colors.neutrals[300]
                }}
                tag="span"
              >
                {new Date().toLocaleDateString()}
              </Text>
              <Button
                onClick={() => {
                  props.removeMensagem(mensagem.id)
                }}
                colorVariant="neutral"
                label={<span class="material-icons">clear</span>}
                styleSheet={{
                  background: 'none',
                  position: 'absolute',
                  right: '-1px',
                  hover: {
                    backgroundColor: appConfig.theme.colors.primary[400]
                  },
                  top: '2px'
                }}
              />
            </Box>
            {mensagem.texto}
          </Text>
        )
      })}
    </Box>
  )
}
