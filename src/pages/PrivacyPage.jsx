import React from 'react'

const PrivacyPage = () => {
  return (
        <div className='min-h-screen flex justify-center bg-white text-black'>
            <div className="py-8 px-2 w-180">
                <p className="text-xl"><b>POLÍTICA DE PRIVACIDADE DO Song Share</b></p>
                <br></br>
                <p><b>Última atualização:</b> 06 de setembro de 2025</p>
                <br></br>
                <p>Esta Política de Privacidade descreve como Song Share ("nós", "nosso") coleta, usa e protege suas informações quando você utiliza o site Song Share, em conformidade com a Lei Geral de Proteção de Dados do Brasil (LGPD - Lei nº 13.709/2018).</p>
                <br></br>
                <p><b>1. Quais Dados Coletamos?</b></p>
                <p>Para fornecer e melhorar nosso serviço, coletamos os seguintes tipos de informações:</p>
                <p className=''>a. Dados Coletados Automaticamente: Quando você acessa nosso site, podemos coletar automaticamente certas informações, incluindo seu endereço de IP, tipo de navegador, provedor de internet, e dados de uso do site.</p>
                <p className=''>b. Dados Fornecidos às Nossas APIs: As buscas que você realiza (nomes de artistas, músicas e letras) são enviadas para nossas funções de servidor para processamento.</p>
                <br></br>
                <p><b>2. Como Usamos Seus Dados?</b></p>
                Utilizamos os dados coletados para as seguintes finalidades:
                <br></br>
                a. Para operar e manter o serviço.
                <br></br>
                <p className='pl-6'><li>Para se comunicar com as APIs de terceiros (Deezer).</li></p>
                
                <p className='pl-6'><li>Para implementar nosso sistema de cache de letras no Firebase.</li></p>
                
                <p className='pl-6'><li>Para monitorar o uso do serviço e prevenir fraudes ou abusos.</li></p>
                
                <p className='pl-6'><li>Para analisar o desempenho e melhorar a experiência do usuário.</li></p>
                <br></br>
                <p><b>3. Compartilhamento de Dados com Terceiros</b></p>
                Nós não vendemos seus dados pessoais. No entanto, compartilhamos informações com os seguintes provedores de serviço para que nossa aplicação funcione:
                <br></br>
                <b>a. Vercel (Hospedagem):</b> Nosso site e nossas funções de API são hospedados na Vercel. A Vercel processa seu endereço de IP para entregar o conteúdo do site e proteger o serviço.
                <br></br>
                <b>b. Google Firebase (Banco de Dados):</b> Usamos o serviço Firestore do Google para armazenar em cache as letras das músicas que são buscadas, a fim de acelerar o carregamento futuro.
                <br></br>
                <b>c. APIs de Músicas (Deezer):</b> As buscas que você realiza são repassadas para as APIs do Deezer para obter os dados das músicas.
                <br></br><br></br>
                <p><b>4. Política de Cookies</b></p>
                <p>a. O que são Cookies? Cookies são pequenos arquivos de texto armazenados no seu navegador que ajudam o site a funcionar e a lembrar de certas informações.</p>
                <p>b. Quais Cookies Usamos? Atualmente, nosso site pode usar cookies essenciais implantados pela nossa plataforma de hospedagem (Vercel) para fins de segurança e funcionamento. No futuro, poderemos adicionar cookies de análise (como os do Google Analytics) para entender como nosso site é usado.</p>
                <p>c. Seu Consentimento: Para cookies que não são estritamente necessários, solicitaremos seu consentimento através de um banner quando você visitar nosso site.</p>
                <p>d. Como Controlar Cookies: Você pode instruir seu navegador a recusar todos os cookies ou a indicar quando um cookie está sendo enviado. No entanto, algumas partes do nosso serviço podem não funcionar corretamente sem eles.</p>
                <br></br>
                <p><b>5. Seus Direitos sob a LGPD</b></p>
                Como titular dos dados, você tem o direito de:

                <p className='pl-6'><li>Confirmar a existência de tratamento de seus dados.</li></p>

                <p className='pl-6'><li>Acessar seus dados.</li></p>

                <p className='pl-6'><li>Corrigir dados incompletos, inexatos ou desatualizados.</li></p>

                <p className='pl-6'><li>Solicitar a anonimização, bloqueio ou eliminação de dados desnecessários.</li></p>
                <br></br>
                E outros direitos previstos na legislação.
                <br></br><br></br>
                <p><b>6. Segurança dos Dados</b></p>
                Empregamos medidas de segurança razoáveis para proteger suas informações contra acesso, alteração ou destruição não autorizados.
                <br></br><br></br>
                <p><b>7. Contato</b></p>
                Se você tiver alguma dúvida sobre esta Política de Privacidade ou sobre como seus dados são tratados, entre em contato conosco pelo e-mail: luandotservices@gmail.com.
            </div>
        </div>
  )
}

export default PrivacyPage
