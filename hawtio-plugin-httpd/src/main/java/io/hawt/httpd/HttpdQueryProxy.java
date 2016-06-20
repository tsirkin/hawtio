package io.hawt.httpd;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.net.ssl.*;
import javax.servlet.ServletException;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.security.KeyManagementException;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.cert.CertificateException;
import java.security.cert.X509Certificate;

/**
 * Created by tsirkin on 19.06.16.
 */
public class HttpdQueryProxy {
    private static final transient Logger LOG = LoggerFactory.getLogger(HttpdQueryProxy.class);

    public HttpdQueryResult queryHttpd(String httpdUrl){
        URL url = null;
        HttpdQueryResult httpdQueryResult = new HttpdQueryResult();
        TrustManager[] trustAllCerts = new TrustManager[] {
                new X509TrustManager() {
                    public java.security.cert.X509Certificate[] getAcceptedIssuers() {
                        return null;
                    }

                    public void checkClientTrusted(X509Certificate[] certs, String authType) {  }

                    public void checkServerTrusted(X509Certificate[] certs, String authType) {  }

                }
        };

        SSLContext sc = null;
        try {
            sc = SSLContext.getInstance("SSL");
        } catch (NoSuchAlgorithmException e) {
            LOG.warn("",e);
        }
        try {
            sc.init(null, trustAllCerts, new java.security.SecureRandom());
        } catch (KeyManagementException e) {
            LOG.warn("",e);
        }
        HttpsURLConnection.setDefaultSSLSocketFactory(sc.getSocketFactory());

        // Create all-trusting host name verifier
        HostnameVerifier allHostsValid = new HostnameVerifier() {
            public boolean verify(String hostname, SSLSession session) {
                return true;
            }
        };
        // Install the all-trusting host verifier
        HttpsURLConnection.setDefaultHostnameVerifier(allHostsValid);
        try {
            url = new URL(httpdUrl);
        } catch (MalformedURLException e) {
            LOG.warn("Problem with url to httpd ",e);
            httpdQueryResult.setQueryStatus(HttpdQueryStatus.WRONG_URL);
            return httpdQueryResult;
        }
        String rawHttpdStatusResult;
        try {
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            // connection.setDoInput(true);
            // connection.setDoOutput(false);
            String contentType = connection.getContentType();
            if (contentType.indexOf("text/html") == -1) {
                LOG.warn("Apache returned a non text result " + contentType);
                httpdQueryResult.setQueryStatus(HttpdQueryStatus.STRANGE_RESULT);
                return httpdQueryResult;
            }
            InputStream inputStream = connection.getInputStream();
            ByteArrayOutputStream result = new ByteArrayOutputStream();
            byte[] buffer = new byte[1024];
            int length;
            while ((length = inputStream.read(buffer)) != -1) {
                result.write(buffer, 0, length);
            }
            rawHttpdStatusResult = result.toString("UTF-8");
        }catch (IOException e) {
            LOG.warn("Error reading httpd status ",e);
            httpdQueryResult.setQueryStatus(HttpdQueryStatus.WRONG_URL);
            return httpdQueryResult;
        }
        httpdQueryResult.setQueryStatus(HttpdQueryStatus.SUCCESS);
        httpdQueryResult.setRawResult(rawHttpdStatusResult);
        return httpdQueryResult;
    }
}
