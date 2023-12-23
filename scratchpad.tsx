while (reader) {
            
            const { done, value } = await reader.read();

            if (done) {
              setIsStreamingRecords(false);
              break;
            }

            let chunk = decoder.decode(value);
            chunk = unprocessed + chunk;
            let jsons = chunk.split("\n");

            unprocessed = jsons.pop() || "";

            for (let i = 0; i < jsons.length; i++) {
              let data = JSON.parse(jsons[i]);
              setTimeout(() => {
                setRecords((prevRecords) => [...prevRecords, data]);
              }, 100);
            }
          }