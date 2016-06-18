package io.hawt.httpd;

/**
 * Created by tsirkin on 19.06.16.
 */
public class HttpdQueryResult {
    private String queryStatus;
    private String rawResult;

    public String getQueryStatus(){
        return queryStatus;
    }
    void setQueryStatus(String status){
        queryStatus = status;
    }
    public String getRawResult(){
        return rawResult;
    }
    void setRawResult(String result){
        rawResult = result;
    }
}
