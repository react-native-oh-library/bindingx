cmake_minimum_required(VERSION 3.13)
set(CMAKE_VERBOSE_MAKEFILE on)

file(GLOB rnoh_bindingx_SRC CONFIGURE_DEPENDS *.cpp)
add_library(rnoh_bindingx SHARED ${rnoh_bindingx_SRC})
target_include_directories(rnoh_bindingx PUBLIC ${CMAKE_CURRENT_SOURCE_DIR})
target_link_libraries(rnoh_bindingx PUBLIC rnoh)

