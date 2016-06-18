package io.hawt.httpd;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;

/**
 * Created by tsirkin on 19.06.16.
 */
public class HttpdQueryProxy {
    private static final transient Logger LOG = LoggerFactory.getLogger(HttpdQueryProxy.class);

    public HttpdQueryResult queryHttpd(String httpdUrl){
        URL url = null;
        HttpdQueryResult httpdQueryResult = new HttpdQueryResult();
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
            connection.setDoInput(true);
            connection.setDoOutput(false);
            String contentType = connection.getContentType();
            if (!contentType.equals("text/plain")) {
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
        httpdQueryResult.setRawResult(rawHttpdStatusResult);
        return httpdQueryResult;
    }
}
