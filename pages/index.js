import { Box, Button, Text, TextField, Image } from '@skynexui/components'
import React from 'react'
import { useRouter } from 'next/router'
import appConfig from '../config.json'
import { render } from 'react-dom'

function Title(props) {
  const Tag = props.tag || 'h1'
  return (
    <>
      <Tag>{props.children}</Tag>
      <style jsx>{`
        ${Tag} {
          color: ${appConfig.theme.colors.neutrals['050']};
          font-size: 24px;
          font-weight: 600;
        }
      `}</style>
    </>
  )
}

// function HomePage() {
//   return (
//     <div>
//       <GlobalStyle />
//       <Title tag="h2">Boas vindas de volta!</Title>
//       <h2>Discord - Alura Matrix</h2>
//     </div>
//   )
// }

// export default HomePage

export default function PaginaInicial() {
  const [username, setUsername] = React.useState('')
  const router = useRouter()

  const [dadosDoGitHub, setDadosDoGitHub] = React.useState({})

  React.useEffect(() => {
    fetch(`https://api.github.com/users/` + username)
      .then(respostaDoServidor => {
        return respostaDoServidor.json()
      })
      .then(respostaConvertida => {
        console.log('respostaConvertida', respostaConvertida)
        setDadosDoGitHub(respostaConvertida)
      })
  }, [username])

  return (
    <>
      <Box
        styleSheet={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: appConfig.theme.colors.primary[500],
          backgroundImage:
            'url(https://imagens.publico.pt/imagens.aspx/1574515?tp=UH&db=IMAGENS&type=GIF&w=1800&act=resize)',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundBlendMode: 'multiply'
        }}
      >
        <Box
          styleSheet={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: {
              xs: 'column',
              sm: 'row'
            },
            width: '100%',
            maxWidth: '700px',
            borderRadius: '5px',
            padding: '32px',
            margin: '16px',
            boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
            backgroundColor: appConfig.theme.colors.neutrals[700]
          }}
        >
          {/* Formulário */}
          <Box
            as="form"
            onSubmit={function (infosDoEvento) {
              infosDoEvento.preventDefault()
              router.push(`/chat?username=${username}`)
            }}
            styleSheet={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: { xs: '100%', sm: '50%' },
              textAlign: 'center',
              marginBottom: '32px'
            }}
          >
            <Title tag="h2">Boas vindas de volta!</Title>
            <Text
              variant="body3"
              styleSheet={{
                marginBottom: '32px',
                color: appConfig.theme.colors.neutrals[300]
              }}
            >
              {appConfig.name}
            </Text>

            <TextField
              placeholder="Digite seu nome de usuário"
              value={username}
              onChange={function () {
                console.log('usuário digitou', event.target.value)
                const valor = event.target.value
                // isso troca o valor da variável através do React
                setUsername(valor)
                //
              }}
              fullWidth
              textFieldColors={{
                neutral: {
                  textColor: appConfig.theme.colors.neutrals[200],
                  mainColor: appConfig.theme.colors.neutrals[900],
                  mainColorHighlight: appConfig.theme.colors.primary[500],
                  backgroundColor: appConfig.theme.colors.neutrals[800]
                }
              }}
            />
            <Button
              type="submit"
              label="Entrar"
              fullWidth
              buttonColors={{
                contrastColor: appConfig.theme.colors.neutrals['000'],
                mainColor: appConfig.theme.colors.primary[500],
                mainColorLight: appConfig.theme.colors.primary[400],
                mainColorStrong: appConfig.theme.colors.primary[600]
              }}
            />
          </Box>
          {/* Formulário */}

          {/* Photo Area */}
          <Box
            styleSheet={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              maxWidth: '200px',
              padding: '16px',
              backgroundColor: appConfig.theme.colors.neutrals[800],
              border: '1px solid',
              borderColor: appConfig.theme.colors.neutrals[999],
              borderRadius: '10px',
              flex: 1,
              minHeight: '240px'
            }}
          >
            <Image
              styleSheet={{
                borderRadius: '50%',
                marginBottom: '16px'
              }}
              src={
                username.length >= 1
                  ? `https://github.com/${username}.png`
                  : `https://image-placeholder.com/images/social/github.png`
              }
            />
            <Text
              variant="body4"
              styleSheet={{
                color: appConfig.theme.colors.neutrals[200],
                backgroundColor: appConfig.theme.colors.neutrals[900],
                padding: '3px 10px',
                borderRadius: '1000px'
              }}
            >
              <p>{dadosDoGitHub.name}</p>
            </Text>
            <Text
              variant="body4"
              styleSheet={{
                color: appConfig.theme.colors.neutrals[200],
                backgroundColor: appConfig.theme.colors.neutrals[900],
                padding: '3px 10px',
                marginTop: '2.5px',
                borderRadius: '1000px'
              }}
            >
              {username}
            </Text>
          </Box>
          {/* Photo Area */}
        </Box>
      </Box>
    </>
  )
}
