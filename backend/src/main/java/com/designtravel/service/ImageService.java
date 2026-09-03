package com.designtravel.service;

import com.designtravel.dto.ImageDto;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class ImageService {

    private static final Logger log = LoggerFactory.getLogger(ImageService.class);

    private final RestClient restClient;
    private final ObjectMapper objectMapper;

    @Value("${travel.api.unsplash.key:}")
    private String unsplashAccessKey;

    @Value("${travel.api.unsplash.url:https://api.unsplash.com/search/photos}")
    private String unsplashUrl;

    public ImageService(RestClient restClient, ObjectMapper objectMapper) {
        this.restClient = restClient;
        this.objectMapper = objectMapper;
    }

    @Cacheable(value = "imageCache", key = "#query.toLowerCase() + '_' + #count")
    public List<ImageDto> searchPhotos(String query, int count) {
        int limit = Math.max(1, Math.min(count, 12));

        if (unsplashAccessKey != null && !unsplashAccessKey.isBlank()) {
            try {
                String uri = String.format("%s?query=%s&per_page=%d&orientation=landscape",
                        unsplashUrl, query.replace(" ", "+"), limit);

                String response = restClient.get()
                        .uri(uri)
                        .header("Authorization", "Client-ID " + unsplashAccessKey)
                        .retrieve()
                        .body(String.class);

                JsonNode root = objectMapper.readTree(response);
                JsonNode results = root.path("results");
                if (results.isArray() && !results.isEmpty()) {
                    List<ImageDto> list = new ArrayList<>();
                    for (JsonNode node : results) {
                        String id = node.path("id").asText();
                        String regular = node.path("urls").path("regular").asText();
                        String small = node.path("urls").path("small").asText();
                        String thumb = node.path("urls").path("thumb").asText();
                        String alt = node.path("alt_description").asText(query);
                        String photographer = node.path("user").path("name").asText("Unsplash Traveler");
                        String profile = node.path("user").path("links").path("html").asText("https://unsplash.com");

                        list.add(new ImageDto(id, regular, small, thumb, alt, photographer, profile));
                    }
                    return list;
                }
            } catch (Exception ex) {
                log.warn("Unsplash API request failed: {}. Utilizing curated photography fallback.", ex.getMessage());
            }
        }

        return getCuratedFallbackImages(query, limit);
    }

    /**
     * Editorial-grade fallback imagery from Unsplash CDN
     */
    private List<ImageDto> getCuratedFallbackImages(String query, int limit) {
        Map<String, List<String>> destinationPhotoMap = Map.of(
            "kyoto", List.of(
                "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=85",
                "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1600&q=85",
                "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=1600&q=85",
                "https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=1600&q=85"
            ),
            "paris", List.of(
                "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1600&q=85",
                "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=1600&q=85",
                "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1600&q=85",
                "https://images.unsplash.com/photo-1520939817895-060bdef4ad1b?auto=format&fit=crop&w=1600&q=85"
            ),
            "banff", List.of(
                "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&w=1600&q=85",
                "https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=1600&q=85",
                "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=85"
            ),
            "rome", List.of(
                "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1600&q=85",
                "https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?auto=format&fit=crop&w=1600&q=85",
                "https://images.unsplash.com/photo-1531572753322-ad063cecc140?auto=format&fit=crop&w=1600&q=85"
            ),
            "bali", List.of(
                "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1600&q=85",
                "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1600&q=85",
                "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1600&q=85"
            )
        );

        String key = destinationPhotoMap.keySet().stream()
                .filter(k -> query.toLowerCase().contains(k))
                .findFirst()
                .orElse("paris");

        List<String> urls = destinationPhotoMap.getOrDefault(key, destinationPhotoMap.get("paris"));
        List<ImageDto> list = new ArrayList<>();
        for (int i = 0; i < Math.min(urls.size(), limit); i++) {
            String url = urls.get(i);
            list.add(new ImageDto(
                    "curated-" + i,
                    url,
                    url + "&w=600",
                    url + "&w=200",
                    query + " scenic perspective",
                    "Designesthetics Curated",
                    "https://unsplash.com"
            ));
        }
        return list;
    }
}
