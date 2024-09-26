import AppLogo from "@/src/ui/app-logo";
import { Footer } from "@/src/ui/components";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <>
      <main className="flex min-h-screen flex-col p-6">
        <div className="flex h-20 shrink-0 items-center rounded-lg bg-black p-4 md:h-[150px] sm:pl-10">
          <Link href="/">
            <AppLogo />
          </Link>
        </div>
        <div className="mt-4 flex grow flex-col gap-4">
          <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10">
            <h1 className="text-xl text-gray-800 md:text-3xl font-bold">
              Política de privacidad de JMO Ventures
            </h1>
            <p className="text-lg text-gray-700 md:text-xl">
              Su privacidad es importante para nosotros. La política de JMO
              Ventures es respetar su privacidad y cumplir con todas las leyes y
              normas de aplicación con respecto a cualquier información personal
              que podamos recopilar sobre usted, incluido a través de nuestra
              aplicación, Alex mobile, y sus servicios asociados. Información
              personal es cualquier información sobre usted que se pueda usar
              para identificarle. Esto incluye información sobre usted como
              persona (como nombre, dirección y fecha de nacimiento), sus
              dispositivos, datos de pago e incluso información sobre cómo usa
              una aplicación o servicio online.
            </p>
            <p className="text-lg text-gray-700 md:text-xl">
              En caso de que nuestra aplicación contenga enlaces a sitios y
              servicios de terceros, tenga en cuenta que esos sitios y servicios
              tienen sus propias políticas de privacidad. Después de seguir un
              enlace a cualquier contenido de terceros, debe leer la información
              publicada de su política de privacidad sobre cómo recopilan y
              utilizan la información personal. Esta Política de privacidad no
              es aplicable a ninguna de sus actividades después de salir de
              nuestra aplicación.
            </p>
            <p className="text-lg text-gray-700 md:text-xl">
              Esta política entra en vigor el 22 de agosto de 2023.
            </p>
            <p className="text-lg text-gray-700 md:text-xl">
              Última actualización: 26 de septiembre de 2024.
            </p>

            <h2 className="text-lg text-gray-800 md:text-2xl font-bold">
              Información que recopilamos
            </h2>
            <p className="text-lg text-gray-700 md:text-xl">
              La información que recopilamos se clasifica en una de estas dos
              categorías: información "proporcionada voluntariamente" e
              información "recopilada automáticamente".
            </p>
            <p className="text-lg text-gray-700 md:text-xl">
              Información "proporcionada voluntariamente" se refiere a cualquier
              información que usted nos proporcione de forma consciente y activa
              al utilizar nuestra aplicación y sus servicios asociados.
            </p>
            <p className="text-lg text-gray-700 md:text-xl">
              Información "recopilada automáticamente" se refiere a cualquier
              información enviada automáticamente por su dispositivo durante su
              acceso a nuestra aplicación y sus servicios asociados.
            </p>

            <h2 className="text-lg text-gray-800 md:text-2xl font-bold">
              Datos de registro
            </h2>
            <p className="text-lg text-gray-700 md:text-xl">
              Cuando accede a nuestros servidores a través de nuestra
              aplicación, podemos registrar automáticamente los datos estándar
              proporcionados por su dispositivo. Esto puede incluir la dirección
              de protocolo de Internet (IP) de su dispositivo, el tipo y la
              versión de su dispositivo, su actividad dentro de la aplicación,
              la hora y la fecha, y otros detalles sobre su uso.
            </p>
            <p className="text-lg text-gray-700 md:text-xl">
              Además, cuando encuentra ciertos errores mientras usa la
              aplicación, recopilamos automáticamente datos sobre el error y las
              circunstancias que rodearon la incidencia. Estos datos pueden
              incluir detalles técnicos sobre su dispositivo, lo que estaba
              tratando de hacer cuando ocurrió el error y otra información
              técnica relacionada con el problema. Podrá, o no, recibir un aviso
              de dichos errores, incluso en el momento en que ocurran,
              informándole de que se han producido o de cuál es la naturaleza
              del error.
            </p>
            <p className="text-lg text-gray-700 md:text-xl">
              Tenga en cuenta que, si bien es posible que esta información no le
              identifique personalmente por sí misma, puede que sea posible
              combinarla con otros datos para identificar personalmente a
              personas individuales.
            </p>

            <h2 className="text-lg text-gray-800 md:text-2xl font-bold">
              Información personal
            </h2>
            <p className="text-lg text-gray-700 md:text-xl">
              Podemos solicitar información personal — por ejemplo, cuando nos
              envía contenido o cuando se pone en contacto con nosotros — que
              puede incluir uno o más de los siguientes datos:
            </p>
            <ul className="list-disc ml-6 text-lg text-gray-700 md:text-xl">
              <li>Nombre</li>
              <li>Correo electrónico</li>
            </ul>

            <h2 className="text-lg text-gray-800 md:text-2xl font-bold">
              Contenido generado por los usuarios
            </h2>
            <p className="text-lg text-gray-700 md:text-xl">
              Consideramos que el "contenido generado por los usuarios" incluye
              materiales (texto, imágenes y/o contenido de video) proporcionados
              voluntariamente por nuestros usuarios con el fin de que se
              publiquen en nuestra plataforma, sitio web o para que se vuelvan a
              publicar en nuestros canales de redes sociales. Todo el contenido
              generado por los usuarios está vinculado a la cuenta o la
              dirección de correo electrónico utilizada para enviar los
              materiales.
            </p>
            <p className="text-lg text-gray-700 md:text-xl">
              Tenga en cuenta que cualquier contenido que envíe con el fin de
              que se publique será público después de la publicación (y su
              posterior revisión o proceso de evaluación). Una vez publicado,
              puede ser accesible para terceros no cubiertos por esta Política
              de privacidad.
            </p>

            <h2 className="text-lg text-gray-800 md:text-2xl font-bold">
              Razones legítimas para procesar su información personal
            </h2>
            <p className="text-lg text-gray-700 md:text-xl">
              Solo recopilamos y usamos su información personal cuando tenemos
              una razón legítima para hacerlo. En cuyo caso, solo recopilamos
              información personal que sea razonablemente necesaria para
              prestarle nuestros servicios.
            </p>

            <h2 className="text-lg text-gray-800 md:text-2xl font-bold">
              Recopilación y uso de información
            </h2>
            <p className="text-lg text-gray-700 md:text-xl">
              Podemos recopilar información personal proporcionada por usted
              cuando realiza cualquiera de las siguientes acciones en nuestro
              sitio web:
            </p>
            <ul className="list-disc ml-6 text-lg text-gray-700 md:text-xl">
              <li>Registrarse para crear una cuenta</li>
              <li>Comprar una suscripción</li>
              <li>
                Utilizar un dispositivo móvil o un navegador web para acceder a
                nuestro contenido
              </li>
              <li>
                Ponerse en contacto con nosotros por correo electrónico, redes
                sociales o cualquier tecnología similar
              </li>
              <li>Cuando nos menciona en redes sociales</li>
            </ul>
            <p className="text-lg text-gray-700 md:text-xl">
              Podemos recopilar, retener, usar y divulgar información con los
              siguientes fines, y la información personal no se procesará
              posteriormente de ninguna manera que sea incompatible con estos
              fines:
            </p>
            <ul className="list-disc ml-6 text-lg text-gray-700 md:text-xl">
              <li>
                Proporcionarle las funciones y servicios principales de nuestra
                aplicación y plataforma
              </li>
              <li>
                Permitirle adaptar o personalizar su experiencia en nuestro
                sitio web
              </li>
              <li>Entregarle productos y/o servicios</li>
              <li>Ponernos en contacto y comunicarnos con usted</li>
              <li>
                Análisis, investigación de mercado y desarrollo comercial,
                incluido para operar y mejorar nuestra aplicación, aplicaciones
                asociadas y plataformas de redes sociales asociadas
              </li>
              <li>
                Permitirle acceder a y utilizar nuestra aplicación, plataformas
                asociadas y canales de redes sociales asociados
              </li>
              <li>
                Fines administrativos y de mantenimiento de registros internos
              </li>
              <li>
                Seguridad y prevención del fraude, y para garantizar que
                nuestros sitios y aplicaciones sean seguros y se utilicen de
                acuerdo con nuestras condiciones de uso
              </li>
            </ul>
            <p className="text-lg text-gray-700 md:text-xl">
              Podemos combinar información personal proporcionada
              voluntariamente y recopilada automáticamente con información
              general o datos de investigación que recibimos de otras fuentes
              fiables. Por ejemplo, si da su consentimiento para que accedamos a
              sus perfiles de redes sociales, podemos combinar la información
              extraída de esos perfiles con la información facilitada por usted
              directamente para ofrecerle una experiencia mejorada de nuestra
              aplicación y nuestros servicios.
            </p>

            <h2 className="text-lg text-gray-800 md:text-2xl font-bold">
              Seguridad de su información personal
            </h2>
            <p className="text-lg text-gray-700 md:text-xl">
              Cuando recopilamos y procesamos información personal, y mientras
              conservemos esta información, la protegemos utilizando medios
              comercialmente aceptables para evitar pérdidas y robos, así como
              el acceso, divulgación, copia, uso o modificación no autorizados.
              Aunque haremos todo lo posible para proteger la información
              personal que nos proporcione, le informamos que ningún método de
              transmisión o almacenamiento electrónico es 100 % seguro y nadie
              puede garantizar la seguridad absoluta de los datos.
            </p>

            <p className="text-lg text-gray-700 md:text-xl">
              Usted es responsable de seleccionar la contraseña y su nivel de
              seguridad general, de la que dependerá la seguridad de su propia
              información dentro de los límites de nuestros servicios. Por
              ejemplo, deberá asegurarse de que las contraseñas asociadas con el
              acceso a su información personal y a sus cuentas sean seguras y
              confidenciales
            </p>

            <h2 className="text-lg text-gray-800 md:text-2xl font-bold">
              Durante cuánto tiempo conservamos su información personal
            </h2>
            <p className="text-lg text-gray-700 md:text-xl">
              Conservamos su información personal solo durante el tiempo que sea
              necesario. Este periodo de tiempo puede depender de para qué
              estemos usando su información, de acuerdo con esta Política de
              privacidad. Por ejemplo, si nos ha proporcionado información
              personal como parte de la creación de una cuenta con nosotros,
              podemos retener esta información mientras su cuenta exista en
              nuestro sistema. Si su información personal ya no es necesaria a
              tal fin, la eliminaremos o la haremos anónima eliminando todos los
              detalles que le identifiquen.
            </p>
            <p className="text-lg text-gray-700 md:text-xl">
              Sin embargo, podemos retener su información personal si la
              necesitamos para cumplir con una obligación legal, de contabilidad
              o de notificación, o con fines de archivo de interés público, de
              investigación científica o histórica o con fines estadísticos.
            </p>

            <h2 className="text-lg text-gray-800 md:text-2xl font-bold">
              Privacidad de los niños
            </h2>
            <p className="text-lg text-gray-700 md:text-xl">
              Ninguno de nuestros productos y servicios está dirigido
              directamente a niños menores de 13 años, y no recopilamos a
              sabiendas información personal sobre niños menores de 13 años.
            </p>

            <h2 className="text-lg text-gray-800 md:text-2xl font-bold">
              Divulgación de información personal a terceros
            </h2>

            <p className="text-lg text-gray-700 md:text-xl">
              Podemos divulgar información personal a:
            </p>
            <ul className="list-disc ml-6 text-lg text-gray-700 md:text-xl">
              <li>Una sociedad matriz, filial o afiliada de nuestra empresa</li>
              <li>
                Proveedores de servicios externos con el fin de permitirles
                prestar sus servicios, incluidos (a título enunciativo y no
                limitativo) registradores de errores, cobradores de deudas,
                proveedores de mantenimiento o resolución de problemas, redes
                publicitarias, proveedores de analítica, registradores de
                errores, cobradores de deudas, proveedores de mantenimiento o
                resolución de problemas, asesores profesionales, operadores de
                sistemas de pago.
              </li>
              <li>
                Nuestros empleados, contratistas y/o entidades relacionadas
              </li>
              <li>
                Nuestros agentes o socios comerciales existentes o potenciales
              </li>
              <li>
                Agencias de informes crediticios, juzgados, tribunales y
                autoridades reguladoras, en caso de que no pague los bienes o
                servicios que le hemos proporcionado.
              </li>
              <li>
                Juzgados, tribunales, autoridades reguladoras y agentes del
                orden, según lo requiera la ley, en relación con cualquier
                procedimiento judicial actual o futuro, o para establecer,
                ejercer o defender nuestros derechos legales.
              </li>
              <li>
                Terceros, incluidos agentes o subcontratistas, que nos ayuden a
                proporcionarle información, productos, servicios o marketing
                directo.
              </li>
              <li>Terceros para recopilar y procesar datos.</li>
              <li>
                Una entidad que compre, o a la que transfiramos todos o
                prácticamente todos nuestros activos y negocios.
              </li>
            </ul>

            <h2 className="text-lg text-gray-800 md:text-2xl">
              Los terceros que utilizamos actualmente incluyen:
            </h2>
            <ul className="list-disc ml-6 text-lg text-gray-700 md:text-xl">
              <li>Google Analytics</li>
              <li>Stripe</li>
            </ul>

            <h2 className="text-lg text-gray-800 md:text-2xl font-bold">
              Transferencias internacionales de información personal
            </h2>
            <p className="text-lg text-gray-700 md:text-xl">
              La información personal que recopilamos se almacena y/o procesa en
              Estados Unidos, o donde nosotros o nuestros socios, afiliados y
              proveedores externos mantengamos infraestructuras.
            </p>

            <p className="text-lg text-gray-700 md:text-xl">
              Los países en los que almacenamos, procesamos o a los que
              transferimos su información personal pueden no tener las mismas
              leyes de protección de datos que el país en el que usted
              proporcionó inicialmente la información. Si transferimos su
              información personal a terceros en otros países: (i) realizaremos
              esas transferencias de acuerdo con los requisitos de la ley
              aplicable; y (ii) protegeremos la información personal transferida
              de acuerdo con esta Política de privacidad.
            </p>

            <h2 className="text-lg text-gray-800 md:text-xl font-bold">
              Sus derechos y el control de su información personal
            </h2>
            <p className="text-lg text-gray-700 md:text-xl">
              Su elección: al proporcionarnos información personal, usted
              comprende que recopilaremos, retendremos, usaremos y divulgaremos
              su información personal de acuerdo con esta Política de
              privacidad. No está obligado a proporcionarnos información
              personal; sin embargo, el no hacerlo puede afectar al uso que haga
              de nuestra aplicación o de los productos y/o servicios que se
              ofrecen en ella o a través de ella.
            </p>
            <p className="text-lg text-gray-700 md:text-xl">
              Información de terceros: si recibimos información personal sobre
              usted de un tercero, la protegeremos tal como se establece en esta
              Política de privacidad. Si usted es un tercero que proporciona
              información personal sobre otra persona, declara y garantiza que
              tiene el consentimiento de dicha persona para proporcionarnos su
              información personal.
            </p>
            <p className="text-lg text-gray-700 md:text-xl">
              Permiso de marketing: si previamente ha aceptado que usemos su
              información personal con fines de marketing directo, puede cambiar
              de opinión en cualquier momento poniéndose en contacto con
              nosotros utilizando los datos que se indican abajo.
            </p>
            <p className="text-lg text-gray-700 md:text-xl">
              Acceso: puede solicitar detalles de la información personal que
              tenemos sobre usted.
            </p>
            <p className="text-lg text-gray-700 md:text-xl">
              Corrección: si cree que la información que tenemos sobre usted
              está desactualizada o es incompleta, irrelevante o engañosa,
              póngase en contacto con nosotros utilizando los datos que se
              indican en esta Política de privacidad. Tomaremos medidas
              razonables para corregir cualquier información que se considere
              inexacta, incompleta, engañosa o desactualizada.
            </p>
            <p className="text-lg text-gray-700 md:text-xl">
              No discriminación: no lo discriminaremos por ejercer cualquiera de
              sus derechos sobre su información personal. A menos que su
              información personal sea necesaria para ofrecerle un servicio u
              oferta en particular (por ejemplo, ofrecer un contenido concreto a
              su dispositivo), no le negaremos bienes o servicios ni le
              cobraremos precios o tarifas diferentes por bienes o servicios,
              incluido mediante la concesión de descuentos u otras ventajas, o
              la imposición de sanciones, ni le proporcionaremos un nivel o
              calidad diferente de bienes o servicios.
            </p>
            <p className="text-lg text-gray-700 md:text-xl">
              Notificación de filtraciones de datos: cumpliremos las leyes que
              nos sean de aplicación con respecto a cualquier filtración de
              datos.
            </p>
            <p className="text-lg text-gray-700 md:text-xl">
              Quejas: si cree que hemos incumplido una ley de protección de
              datos relevante y desea presentar una queja, póngase en contacto
              con nosotros utilizando los datos que se indican abajo y
              facilítenos todos los detalles del supuesto incumplimiento.
              Investigaremos su queja de inmediato y le responderemos, por
              escrito, exponiendo el resultado de nuestra investigación y las
              medidas que tomaremos para tratar su queja. También tiene derecho
              a ponerse en contacto con un organismo regulador o una autoridad
              de protección de datos en relación a su queja.
            </p>
            <p className="text-lg text-gray-700 md:text-xl">
              Cancelar suscripción: para cancelar la suscripción a nuestra base
              de datos de correo electrónico o dejar de recibir comunicaciones
              (incluidas las comunicaciones de marketing), póngase en contacto
              con nosotros utilizando los datos que se indican en esta Política
              de privacidad, o cancele la suscripción mediante las funciones de
              exclusión voluntaria incluidas en la comunicación. Es posible que
              necesitemos pedirle información específica para ayudarnos a
              confirmar su identidad.
            </p>

            <h2 className="text-lg text-gray-800 md:text-2xl font-bold">
              Uso de cookies
            </h2>
            <p className="text-lg text-gray-700 md:text-xl">
              Nuestra Política de privacidad cubre el uso de cookies entre su
              dispositivo y nuestros servidores. Una cookie es una pequeña
              porción de información que una aplicación puede almacenar en su
              dispositivo, y que generalmente contiene un identificador único
              que permite a los servidores de la aplicación reconocer su
              dispositivo cuando usa la aplicación; información sobre su cuenta,
              sesión y/o dispositivo; datos adicionales que sirven para cumplir
              la función de la cookie y cualquier información de
              automantenimiento sobre la propia cookie.
            </p>
            <p className="text-lg text-gray-700 md:text-xl">
              Utilizamos cookies para permitir que su dispositivo acceda a las
              funciones principales de nuestra aplicación, para realizar un
              seguimiento del uso y el rendimiento de la aplicación en su
              dispositivo, para adaptar su experiencia en nuestra aplicación a
              sus preferencias y para ofrecer publicidad en su dispositivo.
              Cualquier comunicación de datos de cookies entre su dispositivo y
              nuestros servidores se produce en un entorno seguro.
            </p>
            <p className="text-lg text-gray-700 md:text-xl">
              Consulte nuestra Política de cookies para obtener más información.
            </p>

            <h2 className="text-lg text-gray-800 md:text-2xl font-bold">
              Transferencias comerciales
            </h2>
            <p className="text-lg text-gray-700 md:text-xl">
              Si nosotros o nuestros activos somos adquiridos, o en el caso
              improbable de que cesemos la actividad o vayamos a la quiebra,
              incluiremos datos, incluida su información personal, entre los
              activos transferidos a la parte que nos adquiera. Usted acepta que
              tales transferencias pueden ocurrir, y que cualquier parte que nos
              adquiera podrá, en la medida en que lo permita la ley aplicable,
              continuar usando su información personal de acuerdo con esta
              política, que deberá asumir como base para ejercer cualquier
              derecho de propiedad o uso que tengamos sobre dicha información.
            </p>

            <h2 className="text-lg text-gray-800 md:text-2xl font-bold">
              Límites de nuestra política
            </h2>
            <p className="text-lg text-gray-700 md:text-xl">
              Nuestro aplicación puede tener enlaces a sitios externos que no
              operamos nosotros. Tenga en cuenta que no tenemos ningún tipo de
              control sobre el contenido y las políticas de esos sitios, y no
              podemos aceptar responsabilidad u obligación alguna por sus
              respectivas prácticas de privacidad.
            </p>

            <h2 className="text-lg text-gray-800 md:text-2xl font-bold">
              Cambios a esta Política
            </h2>
            <p className="text-lg text-gray-700 md:text-xl">
              A nuestra discreción, podemos cambiar nuestra Política de
              privacidad para reflejar actualizaciones de nuestros procesos
              comerciales, prácticas aceptables actuales o cambios legislativos
              o normativos. Si decidimos cambiar esta Política de privacidad,
              publicaremos los cambios aquí, en el mismo enlace a través del que
              ha accedido a esta Política de privacidad.
            </p>
            <p className="text-lg text-gray-700 md:text-xl">
              Si los cambios son significativos, o si así lo requiere la ley de
              aplicación, nos pondremos en contacto con usted (en función de sus
              preferencias seleccionadas para nuestras comunicaciones) y con
              todos nuestros usuarios registrados con los nuevos detalles y
              enlaces a la política actualizada o modificada.
            </p>
            <p className="text-lg text-gray-700 md:text-xl">
              Si así lo requiere la ley, obtendremos su permiso o le daremos la
              oportunidad de optar por participar u optar por no participar,
              según corresponda, en cualquier nuevo uso de su información
              personal.
            </p>

            <h2 className="text-lg text-gray-800 md:text-2xl font-bold">
              Divulgaciones adicionales para el cumplimiento del Reglamento
              General de Protección de Datos (RGPD) (UE)
            </h2>

            <h2 className="text-lg text-gray-800 md:text-2xl font-bold">
              Controlador de datos / Procesador de datos
            </h2>
            <p className="text-lg text-gray-700 md:text-xl">
              El RGPD distingue entre organizaciones que procesan información
              personal para sus propios fines (conocidas como "controladores de
              datos") y organizaciones que procesan información personal en
              nombre de otras organizaciones (conocidas como "procesadores de
              datos"). Nosotros, JMO Ventures, situados en la dirección que se
              indica en nuestro epígrafe Contacto, somos un Controlador y/o
              Procesador de datos con respecto a la información personal que
              usted nos proporciona.
            </p>

            <h2 className="text-lg text-gray-800 md:text-2xl font-bold">
              Fundamentos jurídicos para procesar su información personal
            </h2>
            <p className="text-lg text-gray-700 md:text-xl">
              Solo recopilaremos y usaremos su información personal cuando
              tengamos el derecho legítimo de hacerlo. En cuyo caso,
              recopilaremos y usaremos su información personal de forma lícita,
              justa y transparente. Si necesitamos su consentimiento para
              procesar su información personal y usted es menor de 16 años,
              solicitaremos el consentimiento de su padre, madre o tutor legal
              para procesar su información personal con ese fin específico.
            </p>
            <p className="text-lg text-gray-700 md:text-xl">
              Nuestros fundamentos jurídicos dependen de los servicios que
              utiliza y de cómo los utiliza. Esto significa que solo recopilamos
              y usamos su información por los siguientes motivos:
            </p>
            <ul className="list-disc ml-6 text-lg text-gray-700 md:text-xl">
              <li>Consentimiento dado por usted</li>
              <li>Ejecución de un contrato o transacción</li>
              <li>Nuestros intereses legítimos</li>
              <li>Cumplimiento de la ley</li>
            </ul>

            <h2 className="text-lg text-gray-800 md:text-2xl font-bold">
              Consentimiento dado por usted
            </h2>
            <p className="text-lg text-gray-700 md:text-xl">
              Cuando nos da su consentimiento para recopilar y utilizar su
              información personal con un fin específico. Puede retirar su
              consentimiento en cualquier momento utilizando las funciones que
              ofrecemos; sin embargo, esto no afectará al uso de su información
              que ya se haya realizado. Cuando se pone en contacto con nosotros,
              puede dar su consentimiento para que se utilice su nombre y
              dirección de correo electrónico para que podamos responder a su
              consulta. Si bien puede solicitar que eliminemos sus datos de
              contacto en cualquier momento, no podemos retirar ningún correo
              electrónico que ya hayamos enviado. Si tiene más preguntas acerca
              de cómo retirar su consentimiento, no dude en consultarnos
              utilizando los datos que se indican en el epígrafe Contacto de
              esta Política de privacidad.
            </p>

            <h2 className="text-lg text-gray-800 md:text-2xl font-bold">
              Ejecución de un contrato o transacción
            </h2>
            <p className="text-lg text-gray-700 md:text-xl">
              Cuando ha celebrado un contrato o transacción con nosotros, o para
              realizar los pasos preparatorios antes de que celebremos un
              contrato o transacción con usted. Por ejemplo, necesitamos
              información técnica sobre su dispositivo para proporcionar las
              funciones esenciales de nuestra aplicación.
            </p>

            <h2 className="text-lg text-gray-800 md:text-2xl font-bold">
              Nuestros intereses legítimos
            </h2>
            <p className="text-lg text-gray-700 md:text-xl">
              Cuando consideramos que es necesario para nuestros intereses
              legítimos, por ejemplo, para que proporcionemos, operemos,
              mejoremos y comuniquemos nuestros servicios. Por ejemplo,
              recopilamos información técnica sobre su dispositivo para mejorar
              y personalizar su experiencia con nuestra aplicación. Consideramos
              que nuestros intereses legítimos incluyen la investigación y el
              desarrollo, la comprensión de nuestro público, el marketing y la
              promoción de nuestros servicios, las medidas tomadas para operar
              nuestros servicios de manera eficiente, el análisis de marketing y
              las medidas tomadas para proteger nuestros derechos e intereses
              legales.
            </p>

            <h2 className="text-lg text-gray-800 md:text-2xl font-bold">
              Cumplimiento de la ley
            </h2>
            <p className="text-lg text-gray-700 md:text-xl">
              En algunos casos, es posible que tengamos la obligación legal de
              usar o conservar su información personal. Dichos casos pueden
              incluir (entre otros) órdenes judiciales, investigaciones penales,
              solicitudes gubernamentales y obligaciones reglamentarias. Si
              tiene alguna pregunta acerca de cómo retenemos la información
              personal para cumplir la ley, no dude en consultarnos utilizando
              los datos que se indican en el epígrafe Contacto de esta Política
              de privacidad.
            </p>

            <h2 className="text-lg text-gray-800 md:text-2xl font-bold">
              Transferencias internacionales fuera del Espacio Económico Europeo
              (EEE)
            </h2>
            <p className="text-lg text-gray-700 md:text-xl">
              Nos aseguraremos de que cualquier transferencia de información
              personal desde países del Espacio Económico Europeo (EEE) a países
              fuera del EEE esté protegida por las salvaguardias adecuadas, por
              ejemplo, mediante el uso de cláusulas estándar de protección de
              datos aprobadas por la Comisión Europea o el uso de normas
              corporativas vinculantes u otros medios legalmente aceptados.
            </p>

            <h2 className="text-lg text-gray-800 md:text-2xl font-bold">
              Sus derechos y el control de su información personal
            </h2>
            <p className="text-lg text-gray-700 md:text-xl">
              Restringir: tiene derecho a solicitar que restrinjamos el
              procesamiento de su información personal si (i) le preocupa la
              exactitud de su información personal; (ii) cree que su información
              personal ha sido procesada ilegalmente; (iii) necesita que
              conservemos la información personal únicamente a efectos de una
              acción judicial; o (iv) estamos en proceso de considerar su
              objeción en relación con el procesamiento sobre la base de
              intereses legítimos.
            </p>

            <p className="text-lg text-gray-700 md:text-xl">
              Oponerse al procesamiento: tiene derecho a oponerse al
              procesamiento de su información personal que se base en nuestros
              intereses legítimos o el interés público. Si se hace esto, debemos
              proporcionar motivos legítimos convincentes para el procesamiento
              que se antepongan a sus intereses, derechos y libertades, a fin de
              continuar con el procesamiento de su información personal.
            </p>

            <p className="text-lg text-gray-700 md:text-xl">
              Portabilidad de datos: es posible que tenga derecho a solicitar
              una copia de la información personal que tenemos sobre usted.
              Siempre que sea posible, proporcionaremos esta información en
              formato CSV u otro formato legible fácilmente por máquina. También
              puede tener derecho a solicitar que transfiramos esta información
              personal a un tercero.
            </p>

            <p className="text-lg text-gray-700 md:text-xl">
              Eliminación: es posible que tenga derecho a solicitar que
              eliminemos la información personal que tenemos sobre usted en
              cualquier momento, y tomaremos medidas razonables para eliminar su
              información personal de nuestros registros actuales. Si nos
              solicita que eliminemos su información personal, le informaremos
              de cómo la eliminación afecta a su uso de nuestra aplicación,
              sitio web o productos y servicios. Puede haber excepciones a este
              derecho por razones legales específicas que, si corresponde, le
              expondremos en respuesta a su solicitud. Si rescinde o elimina su
              cuenta, eliminaremos su información personal dentro de los 30 días
              posteriores a la eliminación de su cuenta. Tenga en cuenta que los
              motores de búsqueda y terceros similares aún pueden conservar
              copias de su información personal que se haya hecho pública al
              menos una vez, como cierta información de perfil y comentarios
              públicos, incluso después de que haya eliminado la información de
              nuestros servicios o desactivado su cuenta.
            </p>

   
            <h2 className="text-lg text-gray-800 md:text-2xl font-bold">
              Divulgaciones adicionales para el cumplimiento en California (EE.
              UU.)
            </h2>
            <p className="text-lg text-gray-700 md:text-xl">
              Según el artículo 1798.83 del Código Civil de California, si vive
              en California y su relación comercial con nosotros es
              principalmente para fines personales, familiares o domésticos,
              puede preguntarnos sobre la información que divulgamos a otras
              organizaciones con fines de marketing.
            </p>
            <p className="text-lg text-gray-700 md:text-xl">
              Para realizar dicha solicitud, póngase en contacto con nosotros
              utilizando los datos que se indican en esta Política de privacidad
              con "Solicitud de información de privacidad de California" en la
              línea del asunto. Puede realizar este tipo de solicitud una vez
              por año natural. Le enviaremos por correo electrónico una lista de
              categorías de información personal que hayamos revelado a otras
              organizaciones con fines de marketing en el último año natural,
              junto con sus nombres y direcciones. No toda la información
              personal compartida de esta forma está cubierta por el artículo
              1798.83 del Código Civil de California.
            </p>

            <h2 className="text-lg text-gray-800 md:text-2xl font-bold">
              No rastrear
            </h2>
            <p className="text-lg text-gray-700 md:text-xl">
              Algunos navegadores tienen una función de "No rastrear" que le
              permite decirles a los sitios web que no desea que se rastreen sus
              actividades online. En este momento, no respondemos a las señales
              de "No rastrear" del navegador.
            </p>
            <p className="text-lg text-gray-700 md:text-xl">
              Cumplimos con los estándares descritos en esta Política de
              privacidad, y nos aseguramos de recopilar y procesar información
              personal de forma lícita, justa, transparente y con razones
              legales legítimas para hacerlo.
            </p>

            <h2 className="text-lg text-gray-800 md:text-2xl font-bold">
              Cookies y píxeles
            </h2>
            <p className="text-lg text-gray-700 md:text-xl">
              En todo momento, puede rechazar las cookies de nuestro sitio si su
              navegador lo permite. La mayoría de los navegadores le permiten
              activar la configuración de su navegador para rechazar la
              configuración de todas o algunas cookies. En consecuencia, su
              capacidad para limitar las cookies se basa únicamente en las
              capacidades de su navegador. Consulte el epígrafe Cookies de esta
              Política de privacidad para obtener más información.
            </p>

            <h2 className="text-lg text-gray-800 md:text-2xl font-bold">
              Incentivos económicos permitidos por la CCPA (Ley de Privacidad
              del Consumidor de California)
            </h2>
            <p className="text-lg text-gray-700 md:text-xl">
              De conformidad con su derecho a la no discriminación, podemos
              ofrecerle ciertos incentivos económicos permitidos por la CCPA que
              pueden dar lugar a diferentes precios, tarifas o niveles de
              calidad en los bienes o servicios que ofrecemos.
            </p>
            <p className="text-lg text-gray-700 md:text-xl">
              Cualquier incentivo económico permitido por la CCPA que le
              ofrezcamos estará relacionado de una forma razonable con el valor
              de su información personal, y le proporcionaremos términos por
              escrito que describan claramente la naturaleza de dicha oferta. La
              participación en un programa de incentivos económicos requiere de
              su consentimiento previo, que puede revocar en cualquier momento.
            </p>

            <h2 className="text-lg text-gray-800 md:text-2xl font-bold">
              Notificación de recopilación de California
            </h2>
            <p className="text-lg text-gray-700 md:text-xl">
              En los últimos 12 meses, hemos recopilado las siguientes
              categorías de información personal enumeradas en la Ley de
              Privacidad del Consumidor de California:
            </p>
            <ul className="list-disc ml-6 text-lg text-gray-700 md:text-xl">
              <li>
                Identificadores, como nombre, dirección de correo electrónico,
                número de teléfono, nombre de la cuenta, dirección IP e
                identificación o número asignado a su cuenta.
              </li>
            </ul>
            <p className="text-lg text-gray-700 md:text-xl">
              Para obtener más información acerca de la información que
              recopilamos, incluidas las fuentes de las que recibimos
              información, consulte el epígrafe "Información que recopilamos".
              Recopilamos y usamos estas categorías de información personal para
              los fines comerciales descritos en el epígrafe "Recopilación y uso
              de información", incluido para prestar y administrar nuestro
              Servicio.
            </p>

            <h2 className="text-lg text-gray-800 md:text-2xl font-bold">
              Derecho a saber y a eliminar
            </h2>
            <p className="text-lg text-gray-700 md:text-xl">
              Si usted es residente en California, tiene derecho a eliminar la
              información personal que recopilamos sobre usted y a conocer
              cierta información acerca de nuestras prácticas de datos en los 12
              meses anteriores. En concreto, tiene derecho a solicitarnos lo
              siguiente:
            </p>
            <ul className="list-disc ml-6 text-lg text-gray-700 md:text-xl">
              <li>
                Las categorías de información personal que hemos recopilado
                sobre usted
              </li>
              <li>
                Las categorías de fuentes de las que se ha recopilado la
                información personal
              </li>
              <li>
                Las categorías de información personal sobre usted que hemos
                vendido o divulgado con fines comerciales
              </li>
              <li>
                Las categorías de terceros a los que se ha vendido o divulgado
                la información personal con fines comerciales
              </li>
              <li>
                El fin comercial o empresarial para recopilar o vender la
                información personal
              </li>
              <li>
                La información personal específica que hemos recopilado sobre
                usted
              </li>
            </ul>
            <p className="text-lg text-gray-700 md:text-xl">
              Para ejercer cualquiera de estos derechos, póngase en contacto con
              nosotros utilizando los datos que se indican en esta Política de
              privacidad.
            </p>

            <h2 className="text-lg text-gray-800 md:text-2xl font-bold">
              Ley "Shine the Light"
            </h2>
            <p className="text-lg text-gray-700 md:text-xl">
              Si usted es residente en California, además de los derechos
              mencionados anteriormente, tiene derecho a solicitarnos
              información sobre la manera en que compartimos cierta información
              personal, tal como se define en la ley "Shine the Light" de
              California, con terceros y afiliados para sus propios fines de
              marketing directo.
            </p>
            <p className="text-lg text-gray-700 md:text-xl">
              Para recibir esta información, envíenos una solicitud utilizando
              los datos de contacto que se indican en esta Política de
              privacidad. Las solicitudes deben incluir "Solicitud de derechos
              de privacidad de California" en la primera línea de la descripción
              e incluir su nombre, dirección, ciudad, estado y código postal.
            </p>

            <h2 className="text-lg text-gray-800 md:text-2xl font-bold">
              Contacto
            </h2>
            <p className="text-lg text-gray-700 md:text-xl">
              Para cualquier duda o pregunta con respecto a su privacidad, puede
              ponerse en contacto con nosotros utilizando los siguientes datos:
            </p>
            <p className="text-lg text-gray-700 md:text-xl">Wyoming</p>
            <p className="text-lg text-gray-700 md:text-xl">
              support@trackmyspend.co
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
