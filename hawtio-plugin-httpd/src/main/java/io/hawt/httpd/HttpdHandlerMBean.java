package io.hawt.httpd;

/**
 * Created by tsirkin on 17.06.16.
 */
public interface HttpdHandlerMBean {
    HttpdQueryResult httpdRawInfo(String httpd);
}
