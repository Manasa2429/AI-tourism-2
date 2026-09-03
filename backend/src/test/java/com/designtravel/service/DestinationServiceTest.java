package com.designtravel.service;

import com.designtravel.model.Destination;
import com.designtravel.repository.DestinationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.geo.Distance;
import org.springframework.data.geo.GeoResults;
import org.springframework.data.geo.Point;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.data.repository.query.FluentQuery;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.function.Function;

import static org.junit.jupiter.api.Assertions.*;

class DestinationServiceTest {

    private DestinationService destinationService;
    private final List<Destination> mockDb = new ArrayList<>();

    @BeforeEach
    void setUp() {
        mockDb.clear();
        DestinationRepository stubRepo = new DestinationRepository() {
            @Override public List<Destination> findAll() { return new ArrayList<>(mockDb); }
            @Override public Optional<Destination> findById(String id) {
                return mockDb.stream().filter(d -> d.getId().equals(id)).findFirst();
            }
            @Override public List<Destination> findByContinentIgnoreCase(String continent) { return List.of(); }
            @Override public Page<Destination> findByNameContainingIgnoreCaseOrCountryContainingIgnoreCase(String name, String country, Pageable pageable) { return Page.empty(); }
            @Override public GeoResults<Destination> findByLocationNear(Point location, Distance maxDistance) { return null; }
            @Override public List<Destination> findByTag(String tag) { return List.of(); }
            @Override public Page<Destination> searchByKeyword(String keyword, Pageable pageable) { return Page.empty(); }
            @Override public <S extends Destination> S save(S entity) { mockDb.add(entity); return entity; }
            @Override public <S extends Destination> List<S> saveAll(Iterable<S> entities) { return List.of(); }
            @Override public List<Destination> findAll(Sort sort) { return List.of(); }
            @Override public Page<Destination> findAll(Pageable pageable) { return Page.empty(); }
            @Override public <S extends Destination> S insert(S entity) { return null; }
            @Override public <S extends Destination> List<S> insert(Iterable<S> entities) { return List.of(); }
            @Override public <S extends Destination> List<S> findAll(Example<S> example) { return List.of(); }
            @Override public <S extends Destination> List<S> findAll(Example<S> example, Sort sort) { return List.of(); }
            @Override public <S extends Destination> Page<S> findAll(Example<S> example, Pageable pageable) { return Page.empty(); }
            @Override public <S extends Destination> Optional<S> findOne(Example<S> example) { return Optional.empty(); }
            @Override public <S extends Destination> long count(Example<S> example) { return 0; }
            @Override public <S extends Destination> boolean exists(Example<S> example) { return false; }
            @Override public <S extends Destination, R> R findBy(Example<S> example, Function<FluentQuery.FetchableFluentQuery<S>, R> queryFunction) { return null; }
            @Override public boolean existsById(String s) { return false; }
            @Override public List<Destination> findAllById(Iterable<String> strings) { return List.of(); }
            @Override public long count() { return mockDb.size(); }
            @Override public void deleteById(String s) {}
            @Override public void delete(Destination entity) {}
            @Override public void deleteAllById(Iterable<? extends String> strings) {}
            @Override public void deleteAll(Iterable<? extends Destination> entities) {}
            @Override public void deleteAll() {}
        };

        destinationService = new DestinationService(stubRepo, null, null);
    }

    @Test
    void testDiscoverOrGenerateDestination() {
        Destination santorini = Destination.builder()
                .id("san-1")
                .name("Santorini")
                .country("Greece")
                .continent("Europe")
                .build();
        mockDb.add(santorini);

        Destination result = destinationService.discoverOrGenerateDestination("Santorini");
        assertNotNull(result);
        assertEquals("Santorini", result.getName());
        assertEquals("Greece", result.getCountry());
    }

    @Test
    void testSearchAndFilter() {
        Destination kyoto = Destination.builder()
                .id("1")
                .name("Kyoto")
                .country("Japan")
                .continent("Asia")
                .tags(List.of("Culture", "Temples"))
                .avgDailyBudgetUSD(140)
                .build();

        Destination paris = Destination.builder()
                .id("2")
                .name("Paris")
                .country("France")
                .continent("Europe")
                .tags(List.of("Art", "Gastronomy"))
                .avgDailyBudgetUSD(190)
                .build();

        mockDb.add(kyoto);
        mockDb.add(paris);

        // Filter by continent Asia
        Page<Destination> asiaPage = destinationService.searchAndFilter(null, "Asia", null, null, PageRequest.of(0, 10));
        assertEquals(1, asiaPage.getTotalElements());
        assertEquals("Kyoto", asiaPage.getContent().get(0).getName());

        // Filter by keyword "art"
        Page<Destination> artPage = destinationService.searchAndFilter("art", null, null, null, PageRequest.of(0, 10));
        assertEquals(1, artPage.getTotalElements());
        assertEquals("Paris", artPage.getContent().get(0).getName());
    }

    @Test
    void testFindNearbyCalculatesDistance() {
        Destination kyoto = Destination.builder()
                .id("1")
                .name("Kyoto")
                .country("Japan")
                .latitude(35.0116)
                .longitude(135.7681)
                .location(new GeoJsonPoint(135.7681, 35.0116))
                .build();

        mockDb.add(kyoto);

        // Osaka coordinates (approx 40-50 km from Kyoto)
        List<DestinationService.DestinationWithDistance> nearby = destinationService.findNearby(34.6937, 135.5023, 5);

        assertFalse(nearby.isEmpty());
        assertTrue(nearby.get(0).distanceKm() > 30 && nearby.get(0).distanceKm() < 60);
    }
}
