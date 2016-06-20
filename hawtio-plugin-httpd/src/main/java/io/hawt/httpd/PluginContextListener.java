package io.hawt.httpd;

import io.hawt.httpd.HttpdHandler;
import io.hawt.web.plugin.HawtioPlugin;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.annotation.WebListener;
import javax.servlet.ServletContext;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

@WebListener
public class PluginContextListener implements ServletContextListener {

  private static final Logger LOG = LoggerFactory.getLogger(PluginContextListener.class);

  HawtioPlugin plugin = null;

  @Override
  public void contextInitialized(ServletContextEvent servletContextEvent) {

    ServletContext context = servletContextEvent.getServletContext();

    plugin = new HawtioPlugin();
    // TODO: This should be fixed to work the same as the rest hawtio plugins i.e. via web.xml/maven
    plugin.setContext("/httpd-plugin");
    plugin.setName("httpd-plugin");
    plugin.setScripts("plugin/js/httpPlugin.js");
    //plugin.setDomain(null);
    plugin.init();

    HttpdHandler httpdHandler = new HttpdHandler();
    httpdHandler.init();
    LOG.info("Initialized {} plugin", plugin.getName());
  }

  @Override
  public void contextDestroyed(ServletContextEvent servletContextEvent) {
    plugin.destroy();
    LOG.info("Destroyed {} plugin", plugin.getName());
  }
}
