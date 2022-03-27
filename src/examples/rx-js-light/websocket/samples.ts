// pure text
export const MAIL_CONTENT1 = `Message-ID: <79505ff2-020b-4595-68f4-3e045ee025fe@infomaniak.com>
Date: Wed, 23 Feb 2022 16:57:15 +0100
MIME-Version: 1.0
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:91.0) Gecko/20100101 Thunderbird/91.6.1
Content-Language: en-US
To: valentin.richard@infomaniak.com
From: "valentin.richard" <valentin.richard@infomaniak.com>
Subject: test
Content-Type: text/plain; charset=UTF-8; format=flowed
Content-Transfer-Encoding: 7bit

abc

`;

// with cc and bcc
export const MAIL_CONTENT2 = `Message-ID: <56ba46c8-65bf-6fa3-4b5d-8e4a5ede795b@infomaniak.com>
Date: Tue, 1 Mar 2022 13:31:25 +0100
MIME-Version: 1.0
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:91.0) Gecko/20100101 Thunderbird/91.6.1
Content-Language: en-US
To: valentin.richard@infomaniak.com
Cc: valentin.richard+cc@infomaniak.com
Bcc: valentin.richard+bcc@infomaniak.com
Reply-To: valentin.richard+reply@infomaniak.com
From: "valentin.richard" <valentin.richard@infomaniak.com>
Subject: test
Content-Type: text/plain; charset=UTF-8; format=flowed
Content-Transfer-Encoding: 7bit

Hello content`;

// with many cc
export const MAIL_CONTENT3 = `Message-ID: <535dd0ef-e4bd-e558-cc93-25de2bffa1f4@infomaniak.com>
Date: Tue, 1 Mar 2022 13:33:17 +0100
MIME-Version: 1.0
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:91.0) Gecko/20100101 Thunderbird/91.6.1
Content-Language: en-US
To: valentin.richard@infomaniak.com, valentin.richard+to2@infomaniak.com
Cc: valentin.richard+cc1@infomaniak.com, valentin.richard+cc2@infomaniak.com
From: "valentin.richard" <valentin.richard@infomaniak.com>
Subject: awwd
Content-Type: text/plain; charset=UTF-8; format=flowed
Content-Transfer-Encoding: 7bit

wadwdawd`;


// https://docs.microsoft.com/en-us/exchange/configure-content-transfer-encoding-exchange-2013-help
// with html and text
export const MAIL_CONTENT4 = `Content-Type: multipart/alternative; boundary="------------Nq62IH79HdSbdy1U7G20IgNG"
Message-ID: <0f326a86-e523-a660-7cf4-d35ac51fa53d@infomaniak.com>
Date: Tue, 1 Mar 2022 13:38:44 +0100
MIME-Version: 1.0
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:91.0) Gecko/20100101 Thunderbird/91.6.1
Content-Language: en-US
To: valentin.richard@infomaniak.com
From: "valentin.richard" <valentin.richard@infomaniak.com>
Subject: html

This is a multi-part message in MIME format.
--------------Nq62IH79HdSbdy1U7G20IgNG
Content-Type: text/plain; charset=UTF-8; format=flowed
Content-Transfer-Encoding: 7bit

*some html*

--------------Nq62IH79HdSbdy1U7G20IgNG
Content-Type: text/html; charset=UTF-8
Content-Transfer-Encoding: 7bit

<html>
  <head>

    <meta http-equiv="content-type" content="text/html; charset=UTF-8">
  </head>
  <body>
    <p><b>some html</b><br>
    </p>
  </body>
</html>

--------------Nq62IH79HdSbdy1U7G20IgNG--`;

// with attachment
export const MAIL_CONTENT5 = `Content-Type: multipart/mixed; boundary="------------20f7c0nUPvZRtniUu0yqxVCY"
Message-ID: <c90881bf-c781-7810-4c96-081390bce43f@infomaniak.com>
Date: Tue, 1 Mar 2022 13:41:36 +0100
MIME-Version: 1.0
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:91.0) Gecko/20100101 Thunderbird/91.6.1
Content-Language: en-US
To: valentin.richard@infomaniak.com
From: "valentin.richard" <valentin.richard@infomaniak.com>
Subject: file

This is a multi-part message in MIME format.
--------------20f7c0nUPvZRtniUu0yqxVCY
Content-Type: text/plain; charset=UTF-8; format=flowed
Content-Transfer-Encoding: 7bit

attachment

--------------20f7c0nUPvZRtniUu0yqxVCY
Content-Type: text/plain; charset=UTF-8; name="get merge cmd.txt"
Content-Disposition: attachment; filename="get merge cmd.txt"
Content-Transfer-Encoding: base64

Z2l0IGZldGNoICYmIGdpdCByZWJhc2Ugb3JpZ2luL2RldmVsb3AK

--------------20f7c0nUPvZRtniUu0yqxVCY--`

// with html, text and attachment
export const MAIL_CONTENT6 = `Content-Type: multipart/mixed; boundary="------------c2GRySPrU3nYEpLIC0kVMMs9"
Message-ID: <b892e292-8d73-358a-cb7e-345c05776888@infomaniak.com>
Date: Tue, 1 Mar 2022 13:45:54 +0100
MIME-Version: 1.0
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:91.0) Gecko/20100101
 Thunderbird/91.6.1
Content-Language: en-US
To: valentin.richard@infomaniak.com
From: "valentin.richard" <valentin.richard@infomaniak.com>
Subject: file + html + emoji

This is a multi-part message in MIME format.
--------------c2GRySPrU3nYEpLIC0kVMMs9
Content-Type: multipart/alternative;
 boundary="------------hU0mu5QoiIVC8ZgC4eDhF18V"

--------------hU0mu5QoiIVC8ZgC4eDhF18V
Content-Type: text/plain; charset=UTF-8; format=flowed
Content-Transfer-Encoding: 8bit

*some html *ðŸ”¥ <https://emojipedia.org/fire/>âœ¨ 
<https://blog.emojipedia.org/samsungs-shiny-new-sparkles-emoji/>

--------------hU0mu5QoiIVC8ZgC4eDhF18V
Content-Type: text/html; charset=UTF-8
Content-Transfer-Encoding: 8bit

<html>
  <head>

    <meta http-equiv="content-type" content="text/html; charset=UTF-8">
  </head>
  <body>
    <p><b>some html </b><a href="https://emojipedia.org/fire/"
        style="margin: 0px; padding: 0px; font-size: 16px;
        vertical-align: baseline; background: 0px 0px rgb(241, 241,
        241); color: rgb(36, 88, 161); text-decoration: none;
        line-height: 1.4; font-family: &quot;helvetica neue&quot;,
        Helvetica, Arial, sans-serif; font-style: normal;
        font-variant-ligatures: normal; font-variant-caps: normal;
        font-weight: 400; letter-spacing: normal; orphans: 2;
        text-align: left; text-indent: 0px; text-transform: none;
        white-space: nowrap; widows: 2; word-spacing: 0px;
        -webkit-text-stroke-width: 0px;"><span class="emoji"
          style="margin: 0px; padding: 0px; border: 0px; outline: 0px;
          font-size: 16px; vertical-align: baseline; background: 0px
          0px; font-weight: 400; font-family: &quot;apple color
          emoji&quot;, &quot;segoe ui emoji&quot;, &quot;noto color
          emoji&quot;, &quot;android emoji&quot;, emojisymbols,
          &quot;emojione mozilla&quot;, &quot;twemoji mozilla&quot;,
          &quot;segoe ui symbol&quot;;">ðŸ”¥</span></a><a
        href="https://blog.emojipedia.org/samsungs-shiny-new-sparkles-emoji/"
        style="margin: 0px; padding: 0px; font-size: 16px;
        vertical-align: baseline; background: 0px 0px rgb(241, 241,
        241); color: rgb(36, 88, 161); text-decoration: none;
        line-height: 1.4; font-family: &quot;helvetica neue&quot;,
        Helvetica, Arial, sans-serif; font-style: normal;
        font-variant-ligatures: normal; font-variant-caps: normal;
        font-weight: 400; letter-spacing: normal; orphans: 2;
        text-align: left; text-indent: 0px; text-transform: none;
        white-space: nowrap; widows: 2; word-spacing: 0px;
        -webkit-text-stroke-width: 0px;"><span class="emoji"
          style="margin: 0px; padding: 0px; border: 0px; outline: 0px;
          font-size: 16px; vertical-align: baseline; background: 0px
          0px; font-weight: 400; font-family: &quot;apple color
          emoji&quot;, &quot;segoe ui emoji&quot;, &quot;noto color
          emoji&quot;, &quot;android emoji&quot;, emojisymbols,
          &quot;emojione mozilla&quot;, &quot;twemoji mozilla&quot;,
          &quot;segoe ui symbol&quot;;">âœ¨</span></a></p>
  </body>
</html>

--------------hU0mu5QoiIVC8ZgC4eDhF18V--
--------------c2GRySPrU3nYEpLIC0kVMMs9
Content-Type: application/octet-stream; name="test.bin"
Content-Disposition: attachment; filename="test.bin"
Content-Transfer-Encoding: base64

c29tZSBjb250ZW50Cg==

--------------c2GRySPrU3nYEpLIC0kVMMs9--`;


// answer
export const MAIL_CONTENT7 = `Message-ID: <31e04f4d-6e52-f89c-51a8-1303d54834b9@infomaniak.com>
Date: Thu, 3 Mar 2022 13:40:27 +0100
MIME-Version: 1.0
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:91.0) Gecko/20100101
 Thunderbird/91.6.1
Subject: Re: note #1
Content-Language: en-US
To: "valentin.richard" <valentin.richard@infomaniak.com>
References: <cfba50ed-c4f8-47fa-941f-580a8e04bac5@infomaniak.com>
From: "valentin.richard" <valentin.richard@infomaniak.com>
In-Reply-To: <cfba50ed-c4f8-47fa-941f-580a8e04bac5@infomaniak.com>
Content-Type: text/plain; charset=UTF-8; format=flowed
Content-Transfer-Encoding: 7bit

here's my answer

On 02/03/2022 11:00, valentin.richard wrote:
> abc
>
`;
