FROM envoyproxy/envoy:v1.16-latest

ADD ./envoy.yaml /etc/envoy/envoy.yaml
ADD ./crt /etc/
ADD ./key /etc/

CMD /usr/local/bin/envoy -c /etc/envoy/envoy.yaml
