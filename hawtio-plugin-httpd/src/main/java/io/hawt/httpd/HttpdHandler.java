package io.hawt.httpd;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.management.InstanceAlreadyExistsException;
import javax.management.MBeanServer;
import javax.management.ObjectName;
import java.lang.management.ManagementFactory;

/**
 * Created by tsirkin on 17.06.16.
 */
public class HttpdHandler implements HttpdHandlerMBean{
    private static final transient Logger LOG = LoggerFactory.getLogger(HttpdHandler.class);

    private MBeanServer mBeanServer;
    private ObjectName objectName;

    @Override
    public HttpdQueryResult httpdRawInfo(String httpdUrl) {
        HttpdQueryProxy httpdQueryProxy = new HttpdQueryProxy();
        return httpdQueryProxy.queryHttpd(httpdUrl);

    }

    protected ObjectName getObjectName() throws Exception {
        return new ObjectName("hawtio:type=Httpd");
    }

    public void init() {
        objectName = null;
        try {
            objectName = getObjectName();
        } catch (Exception e) {
            LOG.warn("Couldn't create an object name for plugin http");
            throw new RuntimeException("Couldn't create an object name for plugin http",e);
        }
        if (objectName == null) {
            try {
                objectName = getObjectName();
            } catch (Exception e) {
                LOG.warn("Failed to create object name: ", e);
                throw new RuntimeException("Failed to create object name: ", e);
            }
        }

        mBeanServer = ManagementFactory.getPlatformMBeanServer();

        if (mBeanServer != null) {
            try {
                mBeanServer.registerMBean(this, objectName);
            } catch(InstanceAlreadyExistsException iaee) {
                // Try to remove and re-register
                try {
                    mBeanServer.unregisterMBean(objectName);
                    mBeanServer.registerMBean(this, objectName);
                } catch (Exception e) {
                    LOG.warn("Failed to register mbean: ", e);
                    throw new RuntimeException("Failed to register mbean: ", e);
                }
            } catch (Exception e) {
                LOG.warn("Failed to register mbean: ", e);
                throw new RuntimeException("Failed to register mbean: ", e);
            }
        }

    }
    public void destroy() {
        try {
            if (objectName != null && mBeanServer != null) {
                mBeanServer.unregisterMBean(objectName);
            }
        } catch (Exception e) {
            LOG.warn("Exception unregistering mbean: ", e);
            throw new RuntimeException(e);
        }
    }
}
